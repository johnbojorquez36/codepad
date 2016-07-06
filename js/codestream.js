/** GLOBALS **/
var heartbeat_msg = JSON.stringify({event: "heartbeat"});

var Codestream = function(address) {
   var self = this;

   /********* PRIVATE MEMBER VARIABLES **********/

   var ws;
   var address = address;
   var streaming = false;
   var missed_heartbeats = 0;
   var callbacks = new Map();
   var onbeforeunload = this.disconnect; 
   var onopen = startStreaming;
   var onerror = this.disconnect;
   var onmessage = function (msg) {
      var codemessage = JSON.parse(msg.data);

      if (codemessage.event == "heartbeat") {
         missed_heartbeats = 0;
         streaming = true;
      }

      callbacks.get(codemessage.event)(codemessage.data);
   };

   /********* PUBLIC MEMBER VARIABLES *********/

   this.appliedDeltas = false;

   /********* PUBLIC METHODS *********/


   Codestream.prototype.onevent = function(event_type, callback) {
      callbacks.set(event_type, callback);
   }

   Codestream.prototype.connect = function() {
      ws = new WebSocket(address);
      ws.onbeforeunload = onbeforeunload;
      ws.onopen = onopen;
      ws.onerror = onerror;
      ws.onmessage = onmessage;
   }

   Codestream.prototype.disconnect = function() {
      ws.onclose = function() {};
      ws.close();
   }

   Codestream.prototype.setErrorCallback = function(error_func) {
      onerror = error_func;
      ws.onerror = error_func;
   }

   Codestream.prototype.requestToJoinGroup = function(codename, codegroup) {
      ws.send(JSON.stringify({
         event: "join_group",
         data: {
            codename: codename,
            codegroup: codegroup
         }
      }));
   }

   Codestream.prototype.requestGroupInfo = function(codegroup) {
      ws.send(JSON.stringify({
         event: "group_info",
         data: {
            codegroup: codegroup
         }
      }));
   }

   Codestream.prototype.notifyDelta = function(delta) {
      if (!this.appliedDeltas) {
         ws.send(JSON.stringify({
            event: "code_delta",
            data: {
               codename: codeworld.getCodename(),
               codegroup: codeworld.getCodegroupName(),
               delta: delta
            }
         }))
      } else {
         this.appliedDeltas = false;
      }
   }

   Codestream.prototype.isStreaming = function() {
      return streaming;
   }

   /********* PRIVATE METHODS *********/

   function startStreaming() {
      heartbeat = setInterval(function() {
         try {
            missed_heartbeats++;
            if (missed_heartbeats >= 5) {
               streaming = false;
               self.connect();
            }
            ws.send(heartbeat_msg);
         } catch(e) {
            clearInterval(heartbeat);
            heartbeat = null;
            console.warn("Closing connection. Reason: " + e.message);
            ws.close();
       }
    }, 1000);
   }
};