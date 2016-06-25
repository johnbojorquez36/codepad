var heartbeat_msg = JSON.stringify({event: "heartbeat"});

var Codestream = function(address) {
   var self = this;

   /********* PROPERTIES **********/
   self.address = address;
   self.streaming = false;
   self.missed_heartbeats = 0;

   self.onbeforeunload = function() {
      self.ws.onclose = function () {};
      self.ws.close()
   }
   
   self.onopen = function () {
      self.startStreaming();
   }

   self.onerror = function(evt) {
      document.getElementById("codeform").style.display = "inline";
      document.getElementById("codepad").style.display = "none";
      document.getElementById("server_info").innerHTML =
       "codeserver unavailable. try again later.";
      document.getElementById("join_button").disabled = true;
   }

   self.onmessage = function (msg) {
      var codemessage = JSON.parse(msg.data);
      switch(codemessage.event) {
         case "heartbeat":
            console.log("Received heartbeat from server.")
            self.missed_heartbeats = 0;
            self.streaming = true;
            break;
         case "user_joined":
            var codename = codemessage.data.codename;
            var codegroup = codemessage.data.codegroup;
            console.log(codename + " has joined the group " + codegroup);
            break;
      }
   }

   self.connect = function() {
      self.ws = new WebSocket(address);
      self.ws.onbeforeunload = self.onbeforeunload;
      self.ws.onopen = self.onopen;
      self.ws.onerror = self.onerror;
      self.ws.onmessage =  self.onmessage;
   }

   self.startStreaming = function() {
      heartbeat = setInterval(function() {
         try {
            self.missed_heartbeats++;
            if (self.missed_heartbeats >= 5) {
               self.streaming = false;
               self.connect();
            }
            self.ws.send(heartbeat_msg);
         } catch(e) {
            clearInterval(heartbeat);
            heartbeat = null;
            console.warn("Closing connection. Reason: " + e.message);
            self.ws.close();
       }
    }, 1000);
   }

   self.requestToJoinGroup = function(codename, codegroup) {
      self.ws.send(JSON.stringify({
         event: "join_group",
         data: {
            codename: codename,
            codegroup: codegroup
         }
      }));
   }

   self.isStreaming = function() {
      return self.streaming;
   }
}