//FLEX_INCLUDE "common_default.js"

function init() {
	DefaultControls.init();
	
	var parent = Core.window;
	textEdit = new QPlainTextEdit(parent);
	textEdit.move(Core.base_x, Core.base_y);
	textEdit.setStyleSheet("font-size: " + 15 + "px");
	textEdit.resize(600, 65);
	textEdit.show();
	
	writeBtn = new QPushButton(parent);
	writeBtn.text = "Write";
	writeBtn.resize(57, 32);
	writeBtn.styleSheet = "font-size: 15px";
	writeBtn.move(Core.base_x, Core.base_y+textEdit.height+10);
	writeBtn.pressed.connect(writeString);
	
	writeBtn.show();
	
	readString();
}

function getLen() {
	var len;
	var makeString = "";
	if (Core.hasAttr("len") == true) {
		len = Core.getHexValueAttr("len");
	} else {
		len = 256;
	}
	return len;
}

function readString() {
	var len = getLen();
	var makeString = "";
	var endCode = -1;
	if (Core.hasAttr("endcode") == true) {
		endCode = Number(Core.getAttr("endcode"));
	}
	if (len > 0) {
		for (var ccount = 0; ccount < len; ccount++) {
			var ccode = Core.getByte(ccount);
			if ((endCode >= 0) && (ccode == endCode)) {
				break;
			}
			makeString += String.fromCharCode(ccode);
		}
	}
	
	textEdit.plainText = makeString;
	

}

function writeString() {
	var targetLen = getLen();
	var text = textEdit.plainText;
	var endCode = -1;
	
	if (targetLen == 0) {return;}
	
	if (Core.hasAttr("endcode") == true) {
		endCode = Number(Core.getAttr("endcode"));
		targetLen -= 1; //Make space for the end code
			             //If LEN is 1 this will become 0,
				     //The loop below will not be entered.
	}
	
	var ccount = 0;
	if (text.length > 0) {
		for (ccount = 0; ccount < targetLen; ccount++) {
			if (ccount >= text.length) {break;}
			var ccode = text.charCodeAt(ccount);
			if (ccode >= 256) {ccode = 63;} //replace with '?'
			Core.setByte(ccount, ccode);
		}
	}

	if ((endCode >= 0) && (endCode < 256)) {
		Core.setByte(ccount, endCode);
	}
	
	
}