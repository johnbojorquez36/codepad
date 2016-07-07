var Codeworld = function() {
	var codename;
	var codegroup_name;
	var codegroup = new Set();
	var codestream;
	var codepad;

	Codeworld.prototype.show = function() {
		document.getElementById("codepad").style.display = "inline";
	}

	Codeworld.prototype.hide = function() {
		document.getElementById("codepad").style.display = "none";
	}

	Codeworld.prototype.addCoder = function(data) {
    	var list = document.getElementById("coderlist");
    	codegroup.add(data.codename);
    	list.innerHTML = list.innerHTML + data.codename + "<br />";
	};

	Codeworld.prototype.removeCoder = function(data) {
    	codegroup.delete(data.codename);
    	var list = document.getElementById("coderlist");
    	list.innerHTML = "";
    	codegroup.forEach(function (codename) {
    		list.innerHTML = list.innerHTML + codename + "<br />";
    	});
	};

	Codeworld.prototype.displayCodegroupName = function() {
		document.getElementById("codegroup_header").innerHTML = codegroup_name;
	}

	Codeworld.prototype.addCoders = function(coders) {
		var list = document.getElementById("coderlist");
		for (var i = 0; i < coders.length; ++i) {
			codegroup.add(coders[i]);
			list.innerHTML = list.innerHTML + coders[i] + "<br />";
		}
	};

	Codeworld.prototype.applyCodeDelta = function(data) {
    	codestream.appliedDeltas = true;
    	codepad.getEditor().getSession().getDocument().applyDeltas([data.delta]);
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
		}
	}

	Codeworld.prototype.handleChatKeyPress = function(e) {
		if (e.keyCode == 13) {
			this.sendComposedMessage();
			return false;
		}
		return true;
	}

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