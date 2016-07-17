var Codeworld = function(codestream) {
	var that = this;
	var codename;
	var codegroup_name;
	var codegroup = new Set();
	var activeTimers = new Map();
	var markerMap = new Map();
	var codestream = codestream;
	var codepad;
	var codechat = new Codechat(codestream);
	var coder_list = document.getElementById("coderlist");

	codestream.onevent("user_joined", function(data) {
		that.addCoder(data.codename);
	});
	codestream.onevent("user_left", function(data) {
		that.removeCoder(data.codename);
	});

	codechat.onmessagecomposed = function(message) {
		codechat.send(codename, codegroup_name, message);
	}

	Codeworld.prototype.show = function() {
		document.getElementById("codeworld").style.display = "block";
	}

	Codeworld.prototype.hide = function() {
		document.getElementById("codeworld").style.display = "none";
	}

	Codeworld.prototype.addCoder = function(codename) {
    	codegroup.add(codename);
    	that.addToCoderList(codename);
	};

	Codeworld.prototype.removeCoder = function(data) {
    	codegroup.delete(data.codename);
    	that.removeFromCoderList(codename);
	};

	Codeworld.prototype.displayCodegroupName = function() {
		document.getElementById("codegroup-header").innerHTML = codegroup_name;
	}

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

	Codeworld.prototype.addToCoderList = function(codename) {
		coder_list.innerHTML += "<span id='" + codename + 
			"' class='well well-sm codetag'>" + codename + "</span> ";
	};

	Codeworld.prototype.removeFromCoderList = function(codename) {
		coder_list.removeChild(document.getElementById(codename));
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