var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/c_cpp");
editor.setOptions({
	fontFamily: "monospace",
	fontSize: "12pt"
});

function updateLanguage(lang) {
	var lang_mode;
	if (lang == "C/C++") lang_mode = "c_cpp";
	else if (lang == "Java") lang_mode = "java";
	else if (lang == "Scheme") lang_mode = "scheme";
	else if (lang == "Python") lang_mode = "python";
	else if (lang == "JavaScript") lang_mode = "javascript";
	else lang_mode = "plain_text";
	editor.getSession().setMode("ace/mode/" + lang_mode);
}

function updateKeyBindings(style) {
	var handler;
	if (style == "Emacs") handler = "emacs";
	else if (style == "Vim") handler = "vim";
	editor.setKeyboardHandler("ace/keyboard/" + handler);
}

function clearEditor() {
	editor.setValue("");
}