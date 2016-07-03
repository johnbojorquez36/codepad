(ns codeserver.core
  (:require [org.httpkit.server :as server]
            [clojure.data.json :as json]))

(def code-groups (atom {}))
(def channel-map (atom {}))

(defn notify-join
  "Notifies a channel that a user has joined the same group"
  [codename codegroup channel]
  (server/send! channel (json/write-str {:event "user_joined"
                                         :data {:codename codename
                                                :codegroup codegroup}})))

(defn notify-delta
  "Notifies a channel of a user's code delta"
  [codename delta channel]
  (if (not (= (first ((deref channel-map) channel)) codename))
    (do (println codename " " ((deref channel-map) channel))
    (server/send! channel (json/write-str {:event "code_delta"
                                         :data {:codename codename
                                                :delta delta}})))))
(defn notify-group
  "Applies a notification function to each channel in the group"
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

(defn send-heartbeat
  [channel]
  (server/send! channel (json/write-str {:event "heartbeat"
                                         :data {:num_groups
                                                (count (deref code-groups))}})))

(defn handle-join-group
  "Either joins a user with an existing group or creates a new one."
  [data channel]
  (let [codename (data "codename")
        codegroup (data "codegroup")]
    (do (swap! channel-map assoc channel [codename codegroup])
        (add-to-group codename channel codegroup)
        (notify-group codegroup #(notify-join codename codegroup %1)))))

(defn handle-code-delta
  [data]
  (println data)
  (let [codename (data "codename")
        codegroup (data "codegroup")
        delta (data "delta")]
    (notify-group codegroup #(notify-delta codename delta %))))

(defn handle-group-info-request
  [data channel]
  (let [codegroup (data "codegroup")
        num_coders (if (nil? ((deref code-groups) codegroup))
                     0
                     (count (deref group-atm)))]
    (server/send! channel (json/write-str {:event "group_info"
                                           :num_coders num_coders}))))

(defn handle-close
  [status channel]
  (let [user-info ((deref channel-map) channel)]
    (if (nil? user-info)
      (println "\nAnonymous user left.")
      (let [codename (first user-info)
            codegroup (second user-info)
            group-map (deref ((deref code-groups) codegroup))]
        (do (println (str "\n" codename " left the group " codegroup))
            (if (and (= (count group-map) 1) (not (nil? (group-map codename))))
              (do (println (str "Closing the group " codegroup))
                  (swap! code-groups dissoc codegroup))
              (swap! ((deref code-groups) codegroup) dissoc codename))
            (swap! channel-map dissoc channel))))))

(defn handle-event
  "Receives an event as a JSON string and sends to the corresponding handler."
  [event channel]
  (let [event-obj (json/read-str event)
        event-type (event-obj "event")
        event-data (event-obj "data")]
    (cond (= event-type "join_group") (handle-join-group event-data channel)
          (= event-type "heartbeat") (send-heartbeat channel)
          (= event-type "code_delta") (handle-code-delta event-data)
          (= event-type "group_info") (handle-group-info event-data channel)
          :else (println "unknown event received"))))

(defn ws-handler
  "Handles websocket communication of open channels with clients."
  [request]
  (server/with-channel request channel
    (server/on-close channel #(handle-close %1 channel))
    (server/on-receive channel #(handle-event %1 channel))))

(defn print-groups
  []
  (defn print-group
    [group]
    (print (str (first group) ": "))
    (loop [coders (deref (second group))]
      (if (not (empty? coders))
        (do (print (str (first (first coders)) ", "))
            (recur (rest coders)))))
    (println))
  (loop [groups (deref code-groups)]
    (if (not (empty? groups))
      (do (print-group (first groups))
          (recur (rest groups))))))

(defn run-codepad-repl
  []
  (print "admin@codepad.com:~$ ")
  (flush)
  (let [ln (read-line)]
    (cond (= ln "groups") (print-groups)
          (= ln "q") (System/exit 0)
          :else (println "command not recognized")))
  (run-codepad-repl))


(defn -main
  []
  (.start (Thread. run-codepad-repl))
  (server/run-server ws-handler {:port 8081}))
