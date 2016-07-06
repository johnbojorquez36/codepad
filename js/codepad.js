"use strict";

var Codepad = function(lang, style) {
	// Holds the text editor object
	this.editor = ace.edit("editor");

	// Initialize the editor
	this.editor.setTheme("ace/theme/monokai");
	this.editor.setKeyboardHandler("ace/keyboard/" + style);
	this.editor.getSession().setMode("ace/mode/" + lang);
	this.editor.setOptions({
		fontFamily: "monospace",
		fontSize: "12pt"
	});

	Codepad.prototype.setLanguage = function(lang) {
		var lang_mode;
		if (lang == "C/C++") lang_mode = "c_cpp";
		else if (lang == "Java") lang_mode = "java";
		else if (lang == "Scheme") lang_mode = "scheme";
		else if (lang == "Python") lang_mode = "python";
		else if (lang == "JavaScript") lang_mode = "javascript";
		else lang_mode = "plain_text";
		this.editor.getSession().setMode("ace/mode/" + lang_mode);
	}
	

	Codepad.prototype.setStyle = function(style) {
		var handler;
		if (style == "Emacs") handler = "emacs";
		else if (style == "Vim") handler = "vim";
		this.editor.setKeyboardHandler("ace/keyboard/" + handler);
	}

	Codepad.prototype.clear = function() {
		this.editor.setValue("");
	}

	Codepad.prototype.getCode = function() {
		return this.editor.getValue();
	}

	Codepad.prototype.getEditor = function() {
		return this.editor;
	}
};