(ns codeserver.core
  (:require [org.httpkit.server :as server]
            [clojure.data.json :as json]))

(def code-groups (atom {}))

(defn notify-join
  "Notifies a channel that a user has joined the same group"
  [codename codegroup channel]
  (server/send! channel (json/write-str {:event "user_joined"
                                         :data {:codename codename
                                                :codegroup codegroup}})))

(defn notify-delta
  [codename delta channel]
  (server/send! channel (json/write-str {:event "code_delta"
                                         :data {:codename codename
                                                :delta delta}})))
(defn notify-group
  [codegroup notify]
  (loop [group (deref ((deref code-groups) codegroup))]
    (if (not (empty? group))
      (do (notify (second (first group)))
          (recur (rest group))))))

(defn add-to-group
  [codename channel codegroup]
  (if ((deref code-groups) codegroup)
          (swap! ((deref code-groups) codegroup) assoc codename channel)
          (swap! code-groups assoc codegroup (atom {codename channel}))))

(defn join-group
  "Either joins a user with an existing group or creates a new one."
  [data channel]
  (let [codename (data "codename")
        codegroup (data "codegroup")]
    (do (add-to-group codename channel codegroup)
        (notify-group codegroup #(notify-join codename codegroup %1)))))

(defn send-heartbeat
  [channel]
  (server/send! channel (json/write-str {:event "heartbeat"
                                         :data {:num_groups (count (deref code-groups))}})))

(defn handle-code-delta
  [data]
  (println data)
  (let [codename (data "codename")
        codegroup (data "codegroup")
        delta (data "delta")]
    (notify-group codegroup #(notify-delta codename delta %))))

(defn handle-group-info
  [codegroup channel]
  (let [group-atm ((deref code-groups) codegroup)]
    (server/send! channel (json/write-str {:event "group_info"
                                           :num_coders
                                           (if (nil? group-atm)
                                             0
                                             (count (deref group-atm)))}))))

(defn handle-event
  "Receives an event as a JSON string and dispatches the matching function."
  [event channel]
  ;;(println event)
  (let [event-obj (json/read-str event)
        event-type (event-obj "event")]
    (cond (= event-type "join_group") (join-group (event-obj "data") channel)
          (= event-type "heartbeat") (send-heartbeat channel)
          (= event-type "code_delta") (handle-code-delta (event-obj "data"))
          (= event-type "group_info") (handle-group-info (event-obj "codegroup") channel)
          :else (println "unknown event"))))

(defn ws-handler [request]
  (server/with-channel request channel
    (server/on-close channel (fn [status] (println "channel closed: " status)))
    (server/on-receive channel #(handle-event %1 channel))))


(defn -main
  "This should be pretty simple."
  []
  (server/run-server ws-handler {:port 8081}))
