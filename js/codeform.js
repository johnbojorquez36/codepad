/****************************************************************************
 * Just a namespace of functions for controlling and modifying the 'Codeform'
 * displayed on the homepage. 
 ****************************************************************************/

var Codeform = function(codestream) {
	var that = this;

	/********* Codeform DOM Elements *********/
	var form = document.getElementById("codeform");
	var codegroup_input = document.getElementById("codegroup-input");
	var codename_input = document.getElementById("codename-input");
	var codename_info = document.getElementById("codename-info");
	var codegroup_info = document.getElementById("codegroup-info");
	var server_status = document.getElementById("server-status");
	var server_info = document.getElementById("server-info");
	var num_groups = document.getElementById("num-groups");
	var num_coders = document.getElementById("num-coders");
	var world = document.getElementById("codeworld");
	var join_button = document.getElementById("join-button");

	/********* Private Member Variables *********/
	var infoUpdate = null;
	var codestream = codestream;

	/********* Codeform Event Listeners *********/
	codestream.onevent("group_info", function(data) {
		if (data.num_coders > 0) {
			that.updateGroupInfo(data);
			join_button.innerHTML = "Join Group";
		} else {
			join_button.innerHTML = "Create Group";
		}
	});

	codegroup_input.oninput = function () {
		that.clearCodenameError();
		that.clearCodegroupError();
		that.validateInput();
		getGroupInfo();
	};

	codename_input.oninput = function () {
		that.clearCodenameError();
		that.validateInput();
	};
	join_button.onclick = function() {
		var codename = that.getCodename();
		var codegroup = that.getCodegroupName();
		codestream.requestToJoinGroup(codename, codegroup);
	};

	/********* Public Methods *********/
	Codeform.prototype.hide = function() {
		form.style.display = "none";
	};

	Codeform.prototype.show = function() {
		form.style.display = "block";
	};

	Codeform.prototype.updateGroupInfo = function(data) {
	    codegroup_info.style.visibility = "visible";
	    var info = data.num_coders;
	    if (data.num_coders == 1) {
	    	info += " coder";
	    } else {
	    	info += " coders";
	    }
	    codegroup_info.innerHTML = info + " in the group."
	};

	Codeform.prototype.updateServerInfo = function(data) {
		server_status.innerHTML =
       		"<b style='color:#B0DA4C'>Connected</b> to " + server_name;
		server_info.style.visibility = "visible";
		num_groups.innerHTML = data.num_groups;
		num_coders.innerHTML = data.num_users;
	};

	Codeform.prototype.hideGroupInfo = function(data) {
		codegroup_info.style.visibility = "hidden";
	};

	Codeform.prototype.getCodegroupName = function() {
		return htmlEncodeString(codegroup_input.value);
	};

	Codeform.prototype.getCodename = function() {
		return htmlEncodeString(codename_input.value);
	};

	Codeform.prototype.serverError = function() {
      	server_status.innerHTML =
       		"Cannot establish connection with " + server_name + ". Try again later.";
       		server_info.style.visibility = "hidden";
      	join_button.disabled = true;
	};

	Codeform.prototype.disableSubmit = function() {
      	join_button.disabled = true;
	};

	Codeform.prototype.displayCodenameError = function(msg) {
		document.getElementById("codename-form").className += " has-error has-feedback";
		codename_info.style.color = "red";
		codename_info.style.visibility = "visible";
		codename_info.innerHTML = msg;
	};

	Codeform.prototype.displayCodegroupError = function(msg) {
		document.getElementById("codegroup-form").className += " has-error has-feedback";
		codegroup_info.style.color = "red";
		codegroup_info.style.visibility = "visible";
		codegroup_info.innerHTML = msg;
	};

	Codeform.prototype.clearCodenameError = function() {
		var codenameForm = document.getElementById("codename-form");
		codenameForm.className = codenameForm.className.replace(/\bhas-error\b/, " ");
		codenameForm.className = codenameForm.className.replace(/\bhas-feedback\b/, " ");
		document.getElementById("codename-info").innerHTML = "&nbsp;";
	};

	Codeform.prototype.clearCodegroupError = function() {
		var codenameForm = document.getElementById("codegroup-form");
		codenameForm.className = codenameForm.className.replace(/\bhas-error\b/, " ");
		codenameForm.className = codenameForm.className.replace(/\bhas-feedback\b/, " ");
		document.getElementById("codegroup-info").innerHTML = "&nbsp;";
	};

	Codeform.prototype.validateInput = function() {
		document.getElementById("join-button").disabled = 
			document.getElementById("codegroup-input").value == "" 
			|| document.getElementById("codename-input").value == ""
			|| !codestream.isStreaming();
	};

	Codeform.prototype.disableGroupInfoRequest = function() {
		if (infoUpdate != null) {
			clearInterval(infoUpdate);
			infoUpdate = null;
		}
	}

	function getGroupInfo() {
		if (codestream.isStreaming()) {
			var code_group_field = document.getElementById("codegroup-input");
			that.hideGroupInfo();

			if (infoUpdate != null) {
				clearInterval(infoUpdate);
				infoUpdate = null;
			}

			if (code_group_field.value != "") {
				infoUpdate = setInterval(function() {
					codestream.requestGroupInfo(code_group_field.value);
				}, 500);
			}
		}
	};
};