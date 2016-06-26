
var codestream = new Codestream("ws://localhost:8081/web-socket");
codestream.connect();
var codepad = new Codepad("c_cpp", "emacs");
var codename;
var codegroup;
var infoUpdate = null;

codepad.getEditor().on("change", function(e) {codestream.notifyDelta(e.data);});

function checkInput() {
	document.getElementById("join_button").disabled = 
	document.getElementById("code_group").value == "" 
	|| document.getElementById("code_name").value == ""
	|| !codestream.isStreaming();
};

function loadCodepad() {
	if (codestream.isStreaming()) {
		console.log("Server is up! Time to code!");
		codename = document.getElementById("code_name").value;
		codegroup = document.getElementById("code_group").value;
		// Have this return a boolean
		codestream.requestToJoinGroup(codename, codegroup);
		document.getElementById("codeform").style.display = "none";
		document.getElementById("codepad").style.display = "inline";
		document.getElementById("codegroup_header").innerHTML = "<h1>" + codegroup + "</h1>";
	} else {
		alert("No connection with server. No coding today :(");
	}
}

function getGroupInfo() {
	var code_group_field = document.getElementById("code_group");
	document.getElementById("codegroup_info").innerHTML = "";

	if (infoUpdate != null) {
		clearInterval(infoUpdate);
		infoUpdate = null;
	}

	if (code_group_field.value != "") {
		console.log("setting group info interval");
		infoUpdate = setInterval(function() {
			codestream.requestGroupInfo(code_group_field.value);
		}, 2000);
	}
}

document.getElementById("join_button").onclick = loadCodepad;
window.onload = checkInput;