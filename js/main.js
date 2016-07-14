
var server_name = "localhost"
var codeworld = new Codeworld();
var codestream = new Codestream("ws://" + server_name + ":8081/web-socket");
var codepad = new Codepad("c_cpp", "emacs");
codeworld.setCodestream(codestream);
codeworld.setCodepad(codepad);
codestream.connect();
var infoUpdate = null;



codepad.getEditor().on("change", function(e) {codestream.notifyDelta(e);});
window.onload = Codeform.validateInput;

document.getElementById("codegroup-input").oninput = function () {
	Codeform.clearCodenameError();
	Codeform.validateInput();
	getGroupInfo();
}

document.getElementById("reset-button").onclick = function() {codepad.clear()};

document.getElementById("message-composition").onkeydown = function (event) {
	return codeworld.handleChatKeyPress(event);
}

document.getElementById("send-button").onclick = codeworld.sendComposedMessage;

document.getElementById("codename-input").oninput = function () {
	Codeform.clearCodenameError();
	Codeform.validateInput();
}

function getGroupInfo() {
	if (codestream.isStreaming()) {
		var code_group_field = document.getElementById("codegroup-input");
		Codeform.hideGroupInfo();

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
codestream.onevent("group_info", function(data) {
	if (data.num_coders > 0) {
		Codeform.updateGroupInfo(data);
		document.getElementById("join-button").innerHTML = "Join Group";
	} else {
		document.getElementById("join-button").innerHTML = "Create Group";
	}
});
codestream.onevent("join_group_response", handleJoinGroupResponse);
codestream.onevent("chat_message", codeworld.receiveChatMessage);
codestream.onevent("typing_status", codeworld.updateTypingStatus);

function handleJoinGroupResponse(data) {
	if (data.status == "codename_taken") {
		Codeform.displayCodenameError("codename taken");
		Codeform.disableSubmit();
	} else {
		Codeform.hide();
		document.getElementById("codepad-footer").style.display="none";
		codeworld.setCodename(Codeform.getCodename());
		codeworld.setCodegroupName(Codeform.getCodegroupName());
		codeworld.applyDeltas(data.deltas);
		codeworld.show();
		codeworld.displayCodegroupName();
		codeworld.addCoders(data.users);

		if (infoUpdate != null) {
			clearInterval(infoUpdate);
			infoUpdate = null;
		}
	}
};

document.getElementById("join-button").onclick = function() {
		var codename = Codeform.getCodename();
		var codegroup = Codeform.getCodegroupName();
		codestream.requestToJoinGroup(codename, codegroup);
};

function htmlEncodeString(raw) {
	return raw.replace(/[\u00A0-\u9999<>\&]/gim, function(str) {
		return '&#' + str.charCodeAt(0) + ';';
	});
}




