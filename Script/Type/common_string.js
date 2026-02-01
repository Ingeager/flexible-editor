
CommonString = function() {
	this.textEdit = 0;
	this.writeBtn = 0;
	this.statusLabel = 0;
	this.format = "";
}

CommonString.prototype.init = function() {
	var parent = Core.window;
	this.textEdit = new QPlainTextEdit(parent);
	this.textEdit.move(Core.base_x, Core.base_y);
	this.textEdit.styleSheet = Core.customize("edit.stylesheet", "") + "; font-size: " + 15 + "px";
	this.textEdit.show();
	
	var len = this.getLen();
	var rows = 1;
	if (len > 0) {
		rows = Math.ceil(len / 42);
		if (rows > 24) {rows = 24;}
	}
	var editHeight = (rows*18)+12;
	this.textEdit.resize(600, editHeight);
	
	this.writeBtn = new QPushButton(parent);
	this.writeBtn.text = "Write";
	this.writeBtn.resize(57, 32);
	this.writeBtn.styleSheet = "font-size: 15px";
	this.writeBtn.move(Core.base_x, Core.base_y+this.textEdit.height+8);
	this.writeBtn.pressed.connect(this, this.writeString);
	this.writeBtn.show();

	this.statusLabel = new QLabel(parent);
	this.statusLabel.text = "";
	this.statusLabel.resize(400, 20);
	this.statusLabel.styleSheet = "font-size: 14px";
	this.statusLabel.move(Core.base_x+this.writeBtn.width+10, Core.base_y+this.textEdit.height+14);
	this.statusLabel.show();
	
	this.readString();
}

CommonString.prototype.getLen = function() {
	var len;
	if (Core.hasAttr("len") == true) {
		len = Core.getHexValueAttr("len");
	} else {
		len = 256;
	}
	return len;
}

CommonString.prototype.readString = function() {
	var len = this.getLen();
	var makeString = "";
	var endCode = -1;
	
	if (Core.hasAttr("endcode") == true) {
		endCode = Number(Core.getAttr("endcode"));
	}
	
	var convertedStr = "";
	var ccount = 0;
	
	if (len > 0) {
		var buffer = [len];
		
		for (ccount = 0; ccount < len; ccount++) {
			buffer[ccount] = Core.getByte(ccount);
		}
		
		if (this.format != "UTF-8") {
		
			for (ccount = 0; ccount < len; ccount++) {
				ccode = buffer[ccount];
				if ((endCode >= 0) && (ccode == endCode)) {
					break;
				}
				
				makeString += String.fromCharCode(ccode);
			}
			
		} else {

			if (Core.versionDate >= 251205) {
				obj = Core.stringDecode(buffer, len, this.format);
				convertedStr = obj.data;
				
				for (ccount = 0; ccount < obj.size; ccount++) {
					ccode = convertedStr.charCodeAt(ccount);
					if ((endCode >= 0) && (ccode == endCode)) {
						break;
					}
					
					makeString += String.fromCharCode(ccode);
				}
				
				
			} else {
				this.statusLabel.text = "Newer version of Flexible Editor required to read UTF-8.";
			}

		}
	}
	
	this.textEdit.plainText = makeString;

}

CommonString.prototype.writeString = function() {
	var targetLen = this.getLen();
	var text = this.textEdit.plainText;
	var endCode = -1;
	var resultSize = 0;
	
	if (Core.hasAttr("endcode") == true) {
		endCode = Number(Core.getAttr("endcode"));
	}

	if (targetLen <= 0) {
		this.readString();
		return;
	}

	if (this.format != "UTF-8") {
		var ccount = 0;
		if (text.length > 0) {
			for (; ccount < targetLen; ccount++) {
				if (ccount >= text.length) {break;}
				var ccode = text.charCodeAt(ccount);
				if (ccode >= 256) {ccode = 63;} //replace with '?'
				Core.setByte(ccount, ccode);
			}
		}

		if ((endCode >= 0) && (endCode < 256)) {
			if (ccount == targetLen) {
				ccount -= 1;  //Always make space for endCode.
			}
			Core.setByte(ccount, endCode);
			ccount++;
		}
		
		resultSize = ccount;
		
		this.statusLabel.text = "Output byte size: " + resultSize;
		this.readString();
		
	} else {

		if (Core.versionDate >= 251205) {
			var backupText = text;
			if (endCode >= 0) {
				text += String.fromCharCode(endCode);
			}
			var obj = Core.stringEncode(text, text.length, "UTF-8");
			if (endCode >= 0) {
				while (obj.size > targetLen) {
					backupText = backupText.slice(0, backupText.length-1);
					text = backupText;
					text += String.fromCharCode(endCode);
					obj = Core.stringEncode(text, text.length, "UTF-8");
				}
			}
		
			var ccount = 0;
			if (obj.size > 0) {
				for (; ccount < targetLen; ccount++) {
					if (ccount >= obj.size) {break;}
					var byteval = obj.data[ccount];
					Core.setByte(ccount, byteval);
				}
			}

			resultSize = ccount;

			this.statusLabel.text = "Output byte size: " + resultSize;
			this.readString();
		} else {
			this.statusLabel.text = "Newer version of Flexible Editor required to write UTF-8.";
		}

	}
	
	
	
}