var Codeworld = function() {
	var that = this;
	var codename;
	var codegroup_name;
	var codegroup = new Set();
	var activeTimers = new Map();
	var codestream;
	var codepad;

	Codeworld.prototype.show = function() {
		document.getElementById("codepad").style.display = "inline";
	}

	Codeworld.prototype.hide = function() {
		document.getElementById("codepad").style.display = "none";
	}

	Codeworld.prototype.updateChat = function(msg) {
		var chat_box = document.getElementById("chat_box");
		chat_box.innerHTML = chat_box.innerHTML +
		"<div class=\"chat_update\">" + msg + "</div>";
	};

	Codeworld.prototype.addCoder = function(data) {
    	var list = document.getElementById("coderlist");
    	codegroup.add(data.codename);
    	list.innerHTML = list.innerHTML + 
    	"<div id=\"" + data.codename + "\" class=\"well well-sm\">" + data.codename + "</div>";
    	that.updateChat(data.codename + " joined.");
	};

	Codeworld.prototype.removeCoder = function(data) {
    	codegroup.delete(data.codename);
    	var list = document.getElementById("coderlist");
    	list.innerHTML = "";
    	codegroup.forEach(function (codename) {
    		list.innerHTML = list.innerHTML +
    		"<div id=\"" + codename + "\" class=\"well well-sm\">" + data.codename + "</div>";
    	});
    	that.updateChat(data.codename + " left.");
	};

	Codeworld.prototype.displayCodegroupName = function() {
		document.getElementById("codegroup_header").innerHTML = codegroup_name;
	}

	Codeworld.prototype.addCoders = function(coders) {
		var list = document.getElementById("coderlist");
		for (var i = 0; i < coders.length; ++i) {
			codegroup.add(coders[i]);
			list.innerHTML = list.innerHTML + 
    		"<div id=\"" + coders[i] + "\" class=\"well well-sm\">" + coders[i] + "</div>";
		}
	};

	Codeworld.prototype.applyCodeDelta = function(data) {
    	codestream.appliedDeltas = true;
    	codepad.getEditor().getSession().getDocument().applyDeltas([data.delta]);

    	var currentTimer = activeTimers.get(data.codename);
    	if (currentTimer !=  null) {
    		clearTimeout(currentTimer);
    	} else {
    		document.getElementById(data.codename).style.backgroundColor = "#80e5ff";
    	}

    	activeTimers.set(data.codename, setTimeout(function() {
    		document.getElementById(data.codename).style.backgroundColor = "";
    		activeTimers.delete(data.codename);
    	}, 1000));
	};

	Codeworld.prototype.applyDeltas = function(deltas) {
    	for (var i = 0; i < deltas.length; ++i) {
    		codestream.appliedDeltas = true;
    		codepad.getEditor().getSession().getDocument().applyDeltas([deltas[i]]);
    	}
	};

	Codeworld.prototype.sendComposedMessage = function() {
		var message = htmlEncodeString(document.getElementById("message_composition").value);
		document.getElementById("message_composition").value = "";

		if (message != "") {
			var chat_box = document.getElementById("chat_box");
			chat_box.innerHTML = chat_box.innerHTML +
			"<b style=\"color:green\">" + codename +  "</b>: " + message + "<br />";
			chat_box.scrollTop = chat_box.scrollHeight;
		}

		codestream.sendMessageToGroup(message);
	};

	Codeworld.prototype.receiveChatMessage = function(data) {
		var sender = data.codename
		var message = data.message;
		var chat_box = document.getElementById("chat_box");
		chat_box.innerHTML = chat_box.innerHTML +
		"<b>" + sender +  "</b>: " + message + "<br />";
		chat_box.scrollTop = chat_box.scrollHeight;
	};

	Codeworld.prototype.handleChatKeyPress = function(e) {
		if (e.keyCode == 13) {
			that.sendComposedMessage();
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