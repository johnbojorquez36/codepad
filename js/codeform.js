var Codeform = Codeform || {
	updateGroupInfo: function(data) {
	    document.getElementById("codegroup_info").style.display = "inline";
	    document.getElementById("num_coders").innerHTML = data.num_coders;
	},

	updateServerInfo: function(data) {
		document.getElementById("server_info").innerHTML = "codegroups online: " + data.num_groups;
	},

	hideGroupInfo: function(data) {
		document.getElementById("codegroup_info").style.display = "none";
	},

	getCodegroupName: function() {
		return htmlEncodeString(document.getElementById("code_group").value);
	},

	getCodename: function() {
		return htmlEncodeString(document.getElementById("code_name").value);
	},

	hide: function() {
		document.getElementById("codeform").style.display = "none";
	},

	show: function() {
		document.getElementById("codeform").style.display = "inline";
	},

	serverError: function() {
		document.getElementById("codeform").style.display = "inline";
      	document.getElementById("codepad").style.display = "none";
      	document.getElementById("server_info").innerHTML =
       		"codeserver unavailable. try again later.";
       	document.getElementById("codegroup_info").style.display = "none"
      	document.getElementById("join_button").disabled = true;
	},

	disableSubmit: function() {
      	document.getElementById("join_button").disabled = true;
	},

	displayCodenameError: function(msg) {
		document.getElementById("codename_error").style.display = "inline";
		document.getElementById("codename_error_msg").innerHTML = msg;
	},

	displayCodegroupError: function(msg) {
		document.getElementById("codegroup_error").style.display = "inline";
		document.getElementById("codegroup_error_msg").innerHTML = msg;
	},

	checkCodegroupNameLength: function() {
		return document.getElementById("code_group").value.length <= 22;
	},

	checkCodenameLength: function() {
		return document.getElementById("code_name").value.length <= 26;
	},

	validateInput: function() {
		if (!Codeform.checkCodegroupNameLength()) {
			Codeform.displayCodegroupError("too long.");
		} else {
			document.getElementById("codegroup_error").style.display = "none";
		}
		if (!Codeform.checkCodenameLength()) {
			Codeform.displayCodenameError("too long.");
		} else {
			document.getElementById("codename_error").style.display = "none";
		}
		document.getElementById("join_button").disabled = 
			document.getElementById("code_group").value == "" 
			|| !Codeform.checkCodegroupNameLength()
			|| !Codeform.checkCodenameLength()
			|| document.getElementById("code_name").value == ""
			|| !codestream.isStreaming();
	}	
};