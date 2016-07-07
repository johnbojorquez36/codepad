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

	validateInput: function() {
		document.getElementById("join_button").disabled = 
		document.getElementById("code_group").value == "" 
		|| document.getElementById("code_name").value == ""
		|| !codestream.isStreaming();
	}	
};