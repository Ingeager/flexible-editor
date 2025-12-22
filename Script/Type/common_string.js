
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
	this.textEdit.setStyleSheet("font-size: " + 15 + "px");
	this.textEdit.resize(600, 65);
	this.textEdit.show();
	
	this.writeBtn = new QPushButton(parent);
	this.writeBtn.text = "Write";
	this.writeBtn.resize(57, 32);
	this.writeBtn.styleSheet = "font-size: 15px";
	this.writeBtn.move(Core.base_x, Core.base_y+this.textEdit.height+10);
	this.writeBtn.pressed.connect(this, this.writeString);
	this.writeBtn.show();

	this.statusLabel = new QLabel(parent);
	this.statusLabel.text = "";
	this.statusLabel.resize(400, 20);
	this.statusLabel.styleSheet = "font-size: 14px";
	this.statusLabel.move(Core.base_x+this.writeBtn.width+10, Core.base_y+this.textEdit.height+10);
	this.statusLabel.show();
	
	this.readString();
}

CommonString.prototype.getLen = function() {
	var len;
	var makeString = "";
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
	
	var buffer = [len];
	var convertedStr = "";
	var ccount = 0;
	
	if (len > 0) {
		for (ccount = 0; ccount < len; ccount++) {
			buffer[ccount] = Core.getByte(ccount);
		}
		
		if (this.format == "UTF-8") {
			if (Core.versionDate >= 251205) {
				convertedStr = Core.stringDecode(buffer, len, this.format);
				
				for (ccount = 0; ccount < convertedStr.length; ccount++) {
					ccode = convertedStr.charCodeAt(ccount);
					if ((endCode >= 0) && (ccode == endCode)) {
						break;
					}
					
					makeString += String.fromCharCode(ccode);
				}
				
				
			} else {
				this.statusLabel.text = "Newer version of Flexible Editor required to read UTF-8";
			}
			
		} else {
		
			for (ccount = 0; ccount < len; ccount++) {
				ccode = buffer[ccount];
				if ((endCode >= 0) && (ccode == endCode)) {
					break;
				}
				
				makeString += String.fromCharCode(ccode);
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
	
	if (targetLen == 0) {return;}
	
	if (Core.hasAttr("endcode") == true) {
		endCode = Number(Core.getAttr("endcode"));
		targetLen -= 1; //Make space for the end code
			             //If LEN is 1 this will become 0,
				     //The loop below will not be entered.
	}

	if (this.format == "UTF-8") {
		if (Core.versionDate >= 251205) {
			if (endCode >= 0) {
				text += String.fromCharCode(endCode);
			}
			var obj = Core.stringEncode(text, text.length, "UTF-8");

			var stringy = "";
			for (var a = 0; a < obj.size; a++) {
				stringy += obj.data[a].toString(16);
				stringy += " ";
			}
		
			var ccount = 0;
			if (obj.size > 0) {
				for (ccount = 0; ccount < targetLen; ccount++) {
					if (ccount >= obj.size) {break;}
					var byteval = obj.data[ccount];
					Core.setByte(ccount, byteval);
				}
			}
			print(obj.size);
			resultSize = ccount;

			this.statusLabel.text = "Output byte size: " + resultSize;
		} else {
			this.statusLabel.text = "Newer version of Flexible Editor required to write UTF-8";
		}
		
	} else {

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
			ccount++;
		}
		
		resultSize = ccount;
		
		this.statusLabel.text = "Output byte size: " + resultSize;
	}
	
	
	
}