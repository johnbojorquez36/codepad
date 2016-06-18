function checkInput() {
	document.getElementById("join_button").disabled = 
	(document.getElementById("code_group").value == "" 
		|| document.getElementById("code_name").value == "");
};

document.getElementById("join_button").onclick = function(){
	window.location.href = "pad.html";	
}

window.onload = checkInput;