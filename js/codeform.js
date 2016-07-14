var Codeform = Codeform || {
	updateGroupInfo: function(data) {
	    document.getElementById("codegroup-info").style.visibility = "visible";
	    var info = data.num_coders;
	    if (data.num_coders == 1) {
	    	info += " coder";
	    } else {
	    	info += " coders";
	    }
	    document.getElementById("codegroup-info").innerHTML = info + " in the group."
	},

	updateServerInfo: function(data) {
		document.getElementById("server-status").innerHTML =
       		"<b style='color:#B0DA4C'>Connected</b> to " + server_name;
		document.getElementById("server-info").style.visibility = "visible";
		document.getElementById("num-groups").innerHTML = data.num_groups;
	},

	hideGroupInfo: function(data) {
		document.getElementById("codegroup-info").style.visibility = "hidden";
	},

	getCodegroupName: function() {
		return htmlEncodeString(document.getElementById("codegroup-input").value);
	},

	getCodename: function() {
		return htmlEncodeString(document.getElementById("codename-input").value);
	},

	hide: function() {
		document.getElementById("codeform").style.display = "none";
	},

	show: function() {
		document.getElementById("codeform").style.display = "block";
	},

	serverError: function() {
		document.getElementById("codeform").style.display = "block";
      	document.getElementById("codeworld").style.display = "none";
      	document.getElementById("server-status").innerHTML =
       		"Cannot establish connection with " + server_name + ". Try again later.";
       		document.getElementById("server-info").style.visibility = "hidden";
      	document.getElementById("join-button").disabled = true;
	},

	disableSubmit: function() {
      	document.getElementById("join-button").disabled = true;
	},

	displayCodenameError: function(msg) {
		document.getElementById("codename-form").className += " has-error has-feedback";
		var infoElem = document.getElementById("codename-info");
		infoElem.style.color = "red";
		infoElem.style.visibility = "visible";
		infoElem.innerHTML = msg;
	},

	clearCodenameError: function() {
		var codenameForm = document.getElementById("codename-form");
		codenameForm.className = codenameForm.className.replace(/\bhas-error\b/, " ");
		codenameForm.className = codenameForm.className.replace(/\bhas-feedback\b/, " ");
		document.getElementById("codename-info").innerHTML = "&nbsp;";
	},

	displayCodegroupError: function(msg) {
	},

	validateInput: function() {
		document.getElementById("join-button").disabled = 
			document.getElementById("codegroup-input").value == "" 
			|| document.getElementById("codename-input").value == ""
			|| !codestream.isStreaming();
	}	
};