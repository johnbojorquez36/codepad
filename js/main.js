
var codestream = new Codestream("ws://localhost:8081/web-socket");
codestream.connect();

function checkInput() {
	document.getElementById("join_button").disabled = 
	document.getElementById("code_group").value == "" 
	|| document.getElementById("code_name").value == ""
	|| !codestream.isStreaming();
};

function loadCodepad() {
	if (codestream.isStreaming()) {
		console.log("Server is up! Time to code!");
		var codename = document.getElementById("code_name").value;
		var codegroup = document.getElementById("code_group").value
		codestream.requestToJoinGroup(codename, codegroup);
		document.getElementById("codeform").style.display = "none";
		document.getElementById("codepad").style.display = "inline";
	} else {
		alert("No connection with server. No coding today :(");
	}
}

document.getElementById("join_button").onclick = loadCodepad;
window.onload = checkInput;