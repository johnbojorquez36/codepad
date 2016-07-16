var Codeworld = function(codestream) {
	var that = this;
	var codename;
	var codegroup_name;
	var codegroup = new Set();
	var activeTimers = new Map();
	var markerMap = new Map();
	var typingTimer;
	var codestream = codestream;
	var codepad;
	var codechat = new Codechat(codestream);

	codechat.onmessagecomposed = function(message) {
		codechat.send(codename, codegroup_name, message);
	}

	Codeworld.prototype.show = function() {
		document.getElementById("codeworld").style.display = "block";
	}

	Codeworld.prototype.hide = function() {
		document.getElementById("codeworld").style.display = "none";
	}

	Codeworld.prototype.updateChat = function(msg) {
		var chat_box = document.getElementById("chat-box");
		chat_box.innerHTML = chat_box.innerHTML +
		"<div class=\"chat-update\">" + msg + "</div>";
	};

	Codeworld.prototype.addCoder = function(data) {
    	var list = document.getElementById("coderlist");
    	codegroup.add(data.codename);
    	list.innerHTML = list.innerHTML + 
    	"<span id=\"" + data.codename + "\" class=\"well well-sm codetag\">" + data.codename + "</span> ";
    	that.updateChat(data.codename + " joined.");
	};

	Codeworld.prototype.removeCoder = function(data) {
    	codegroup.delete(data.codename);
    	var list = document.getElementById("coderlist");
    	list.innerHTML = "";
    	codegroup.forEach(function (codename) {
    		list.innerHTML = list.innerHTML +
    		"<span id=\"" + codename + "\" class=\"well well-sm codetag\">" + codename + "</span> ";
    	});
    	that.updateChat(data.codename + " left.");
	};

	Codeworld.prototype.displayCodegroupName = function() {
		document.getElementById("codegroup-header").innerHTML = codegroup_name;
	}

	Codeworld.prototype.addCoders = function(coders) {
		var list = document.getElementById("coderlist");
		for (var i = 0; i < coders.length; ++i) {
			codegroup.add(coders[i]);
			list.innerHTML = list.innerHTML + 
    		"<span id=\"" + coders[i] + "\" class=\"well well-sm codetag\">" + coders[i] + "</span> ";
		}
	};

	Codeworld.prototype.applyCodeDelta = function(data) {
		var Range = ace.require('ace/range').Range;
		var markerID;
		var delta = data.delta;
    	codestream.appliedDeltas = true;
    	codepad.getEditor().getSession().getDocument().applyDeltas([delta]);

    	var currentTimer = activeTimers.get(data.codename);
    	if (currentTimer !=  null) {
    		clearTimeout(currentTimer);
    		codepad.getEditor().session.removeMarker(markerMap.get(data.codename));
    	} else {
    		document.getElementById(data.codename).style.backgroundColor = "#80e5ff";
    	}

    	var row = delta.end.row;
    	markerMap.set(data.codename, codepad.getEditor().session.addMarker(new Range(row, 0, row, 1), "myMarker", "fullLine"));

    	activeTimers.set(data.codename, setTimeout(function() {
    		document.getElementById(data.codename).style.backgroundColor = "";
    		activeTimers.delete(data.codename);
    		codepad.getEditor().session.removeMarker(markerMap.get(data.codename));
    	}, 500));
	};

	Codeworld.prototype.applyDeltas = function(deltas) {
    	for (var i = 0; i < deltas.length; ++i) {
    		codestream.appliedDeltas = true;
    		codepad.getEditor().getSession().getDocument().applyDeltas([deltas[i]]);
    	}
	};

	Codeworld.prototype.sendComposedMessage = function() {
		var message = htmlEncodeString(document.getElementById("message-composition").value);
		document.getElementById("message-composition").value = "";

		if (message != "") {
			var chat_box = document.getElementById("chat-box");
			chat_box.innerHTML = chat_box.innerHTML +
			"<b style=\"color:green\">" + codename +  "</b>: " + message + "<br />";
			chat_box.scrollTop = chat_box.scrollHeight;
		}

		codestream.sendMessageToGroup(message);
	};

	Codeworld.prototype.receiveChatMessage = function(data) {
		var sender = data.codename
		var message = data.message;
		var chat_box = document.getElementById("chat-box");
		chat_box.innerHTML = chat_box.innerHTML +
		"<b>" + sender +  "</b>: " + message + "<br />";
		chat_box.scrollTop = chat_box.scrollHeight;
	};

	Codeworld.prototype.updateTypingStatus = function(data) {
		if (data.status == 1) {
			document.getElementById("typing-status").innerHTML =
			data.codename + " is typing...";
		} else {
			document.getElementById("typing-status").innerHTML = "&nbsp;";
		}
	}

	Codeworld.prototype.handleChatKeyPress = function(e) {
		if (typingTimer != null) {
			clearTimeout(typingTimer);
		} else {
			codestream.notifyTypingStatus(1);
		}

		typingTimer = setTimeout(function() {
			codestream.notifyTypingStatus(0);
			typingTimer = null;
		}, 500);

		if (e.keyCode == 13) {
			that.sendComposedMessage();
			clearTimeout(typingTimer);
			typingTimer = null;
			codestream.notifyTypingStatus(0);
			return false;
		}
		return true;
	};

	Codeworld.prototype.setCodename = function(name) {
		codename = name; 
	};

	Codeworld.prototype.setCodegroupName = function(name) {
		codegroup_name = name;
	};

	Codeworld.prototype.setCodestream = function(stream) {
		codestream = stream;
	};

	Codeworld.prototype.setCodepad = function(cp) {
		codepad = cp;
	};

	Codeworld.prototype.getCodestream = function(stream) {
		return codestream;
	};

	Codeworld.prototype.getCodepad = function(stream) {
		return codepad;
	};

	Codeworld.prototype.getCodename = function(name) {
		return codename;
	};

	Codeworld.prototype.getCodegroupName = function(name) {
		return codegroup_name;
	};
}