var heartbeat_msg = JSON.stringify({event: "heartbeat"});

var Codestream = function(address) {
   var self = this;

   /********* PROPERTIES **********/
   self.address = address;
   self.streaming = false;
   self.missed_heartbeats = 0;
   self.appliedDeltas = false;

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
       document.getElementById("codegroup_info").innerHTML = "";
      document.getElementById("join_button").disabled = true;
   }

   self.onmessage = function (msg) {
      var codemessage = JSON.parse(msg.data);
      switch(codemessage.event) {
         case "heartbeat":
            console.log("Received heartbeat from server.")
            self.missed_heartbeats = 0;
            self.streaming = true;
            document.getElementById("server_info").innerHTML =
            "codegroups online: " + codemessage.data.num_groups;
            break;
         case "user_joined":
            alert("joined")
            var codename = codemessage.data.codename;
            var codegroup = codemessage.data.codegroup;
            var div = document.getElementById("coderlist");
            div.innerHTML = div.innerHTML + codename + "<br />";
            break;
         case "code_delta":
            var delta = codemessage.data.delta;
            self.appliedDeltas = true;
            codepad.getEditor().getSession().getDocument().applyDeltas([delta]);
            break;
         case "group_info":
            var num_coders = codemessage.num_coders;
            document.getElementById("codegroup_info").innerHTML = 
            "<span class=\"glyphicon glyphicon-check\" style=\"padding-top:12px;color:green\" ></span> coders: " + num_coders;
            break;
         case "join_group_response":
            if (codemessage.data.error == "codename_taken") {
               alert("codename is taken sorrz");
            } else {
               var coders = codemessage.data.users;
               console.log("CODERS:");
               console.log(msg);
               var div = document.getElementById("coderlist");
               for (var i = 0; i < coders.length; ++i) {
                  div.innerHTML = div.innerHTML + coders[i] + "<br />";
               }
            }
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

   self.requestGroupInfo = function(codegroup) {
      self.ws.send(JSON.stringify({
         event: "group_info",
         data: {
            codegroup: codegroup
         }
      }));
   }

   self.notifyDelta = function(delta) {
      if (!self.appliedDeltas) {
         self.ws.send(JSON.stringify({
            event: "code_delta",
            data: {
               codename: codename,
               codegroup: codegroup,
               delta: delta
            }
         }))
      } else {
         self.appliedDeltas = false;
      }
   }

   self.isStreaming = function() {
      return self.streaming;
   }
}