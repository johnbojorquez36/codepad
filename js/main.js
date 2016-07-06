
var codeworld = new Codeworld();
var codestream = new Codestream("ws://localhost:8081/web-socket");
var codepad = new Codepad("c_cpp", "emacs");
codeworld.setCodestream(codestream);
codeworld.setCodepad(codepad);
codestream.connect();
var infoUpdate = null;

codepad.getEditor().on("change", function(e) {codestream.notifyDelta(e);});
window.onload = Codeform.validateInput;

function getGroupInfo() {
	if (codestream.isStreaming()) {
		var code_group_field = document.getElementById("code_group");
		document.getElementById("codegroup_info").style.display = "none";

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

codestream.setErrorCallback(function() {
	codeworld.hide();
	Codeform.serverError();
});

codestream.onevent("heartbeat", Codeform.updateServerInfo);
codestream.onevent("user_joined", codeworld.addCoder);
codestream.onevent("user_left", codeworld.removeCoder);
codestream.onevent("code_delta", codeworld.applyCodeDelta);
codestream.onevent("group_info", Codeform.updateGroupInfo);
codestream.onevent("join_group_response", handleJoinGroupResponse);

function handleJoinGroupResponse(data) {
	console.log(JSON.stringify(data));
	if (data.status == "codename_taken") {
		Codeform.displayCodenameError("codename taken");
		Codeform.disableSubmit();
	} else {
		Codeform.hide();
		codeworld.setCodename(Codeform.getCodename());
		codeworld.setCodegroupName(Codeform.getCodegroupName());
		codeworld.show();
		codeworld.addCoders(data.users);

		if (infoUpdate != null) {
			clearInterval(infoUpdate);
			infoUpdate = null;
		}
	}
};

document.getElementById("join_button").onclick = function() {
		var codename = Codeform.getCodename();
		var codegroup = Codeform.getCodegroupName();
		codestream.requestToJoinGroup(codename, codegroup);
};




