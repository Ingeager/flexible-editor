//FLEX_INCLUDE "common_bit.js"

CommonInt = function(a_intSize) {
	//Set up defaults. 
	//Important settings can be changed before calling "init".
	//a_intSize is optional here.

	if (a_intSize == undefined) {
		this.bitSize = Core.defaultIntSize;
	} else {
		this.bitSize = a_intSize;
	}
	this.byteSize = 2;	//default. recalculated in 'init'

	this.base = 16; //Up to 51 supported. ("Digits" from 36 to 50 will use character codes 31 and up).
	this.bigEndian = false;
	this.symmetricBase = true;
	this.maxCharSize = 8;
	this.trailZero = false;
	this.previousTextLength = 0;
	this.previousText = "";
	this.signed = false;
	this.usingList = false;
	this.arrayEnable = true;

	this.arr_size = 0;
	this.mul_table = [];
	this.val_table = [];
	this.mul_table_size = 0;
	this.val_table_size = 0;
	
	this.val_table2 = [];
	this.mul_table2 = [];
	this.mul_table2_size = 0;
	this.val_table2_size = 0;
	
	this.hasBitControls = false;
	this.bitClass = {};

	//Array support hack for v250813
	if (Core.versionDate < 250823) {
		Core.arrayIndex = 0;
		Core.arrayByteSize = 2;
		Core.getByteWr = function(a_addr) {return(Core.getByte(a_addr+(Core.arrayIndex*Core.arrayByteSize)));}
		Core.setByteWr = function(a_addr, a_val) {Core.setByte(a_addr+(Core.arrayIndex*Core.arrayByteSize), a_val);}
	} else {
		Core.getByteWr = function(a_addr) {return(Core.getByte(a_addr));}
		Core.setByteWr = function(a_addr, a_val) {Core.setByte(a_addr, a_val);}
	}

	//Core.addFlag('SIGNED');
	
}

CommonInt.prototype.init = function() {


	if (Core.hasAttr("intsize") == true) {
		this.bitSize = Number(Core.getAttr("intsize"));
	}
	this.bitSize &= 0xFFF8;

	this.byteSize = (this.bitSize >> 3);

	//Arrays 
	if (Core.hasAttr("len") == true) {
		if (this.arrayEnable == true) {
			DefaultControls.addArrayTuner();
			if (Core.versionDate >= 250823) {
				Core.setArrayByteSize(this.byteSize);
			} else {
				Core.arrayByteSize = this.byteSize;
			}
		}
	}

	if (Core.getFlag("DECIMAL") == true) {
		this.base = 10;
	}

	if (Core.hasAttr("base")) {
		this.base = Number(Core.getAttr("base"));
		if (this.base < 2) {
			this.base = 16;
		}
	}

	if (Core.getFlag("SIGNED") == true) {
		this.signed = true;
	}

	var a = 256;
	var b = 0;
	do {
		a /= this.base;
		b++;
	} while (a >= this.base);
	if (a > 0) {b++;}
	this.maxCharSize = b*this.byteSize;

	
	if (this.base == 16) {
		this.symmetricBase = true;
		this.maxCharSize = (this.byteSize*2);
	} else if (this.base == 4) {
		this.symmetricBase = true;
		this.maxCharSize = (this.byteSize*4);
	} else if (this.base == 2) {
		this.symmetricBase = true;
		this.maxCharSize = (this.byteSize*8);	
	} else {
		this.symmetricBase = false;
	}

	this.arr_size = this.maxCharSize + 4;
	this.mul_table = new Array(this.arr_size);
	this.val_table = new Array(this.arr_size);
	this.mul_table_size = 0;
	this.val_table_size = 0;
	
	this.val_table2 = new Array(this.byteSize);
	this.mul_table2 = new Array(this.byteSize);
	this.mul_table2_size = 0;
	this.val_table2_size = 0;
	
	var parentWnd = Core.window;

	if (Core.hasAttr("list") == true) {
		this.usingList = true;
	}

	if (this.usingList == false) {		
		this.editCtrl = new QLineEdit(parentWnd);
		this.editCtrl.move(Core.base_x, Core.base_y);
		var fontpx_table = [45, 40, 35, 20, 20, 20, 20, 20];
		//var ctrlWidth_table = [80, 120, 150, 120, 200, 200, 200, 200];
		var ctrlHeight_table = [56, 50, 50, 40, 40, 40, 40, 40];
		var fontpx = 15;
		var ctrlHeight = 40;
		if (this.byteSize < 9) {
			fontpx = fontpx_table[this.byteSize-1];
		//	ctrlWidth = ctrlWidth_table[this.byteSize-1];
			ctrlHeight = ctrlHeight_table[this.byteSize-1];
		}
		var modifier = 0.7;
		var maxChar2 = this.maxCharSize;
		if (this.signed == true) {maxChar2++;}
		ctrlWidth = (Math.floor(maxChar2 * fontpx * modifier) + 15);
		if (ctrlWidth >= 600) {
			ctrlWidth = 600;
		}

		var styleSheet = "font-size: " + fontpx + "px";
		styleSheet = Core.customize("stylesheet", styleSheet);
		this.editCtrl.setStyleSheet(styleSheet);
		this.editCtrl.setAlignment(2);
		this.editCtrl.resize(ctrlWidth, ctrlHeight);
		this.editCtrl.textEdited.connect(this, this.editTextFunc);
		
		this.editCtrl.show();

		this.editSpin = new QSpinBox(parentWnd);
		this.editSpin.move(Core.base_x+ctrlWidth, Core.base_y);
		this.editSpin.resize(15, ctrlHeight);
		this.editSpin.minimum = 0;
		this.editSpin.maximum = 2;
		this.editSpin.value = 1;
		this.editSpin.singleStep = 1;
		this.editSpin['valueChanged(int)'].connect(this, this.upDownFunc);
		this.editSpin.show();

		Core.base_y += ctrlHeight + 10;

	} else {
		this.listCtrl = new QComboBox(parentWnd);
		this.listCtrl.move(Core.base_x, Core.base_y);
		this.listCtrl.resize(600, 40);
		var listId = Core.getAttr("list");
		var listArray = Core.getList(listId);
		var ix;
		for (ix = 0; ix < listArray.length; ix++) {
			this.listCtrl.addItem(ix.toString(16).toUpperCase() + ": " + listArray[ix]);
		}

		this.listCtrl.editable = false;
		this.listCtrl.styleSheet = "font: 25px";
		this.listCtrl['currentIndexChanged(int)'].connect(this, this.listChangeFunc);
		this.listCtrl.show();

		Core.base_y += 50;
	  
	}
	
	
	this.updateControl();
	
	
	if (Core.hasAttr("bit") == true) {
		this.bitClass = new CommonBit();
		this.bitClass.initBitAttr(this.bitSize);
		this.bitClass.parentIntClass = this;
		this.bitClass.changeFunc = function(a_bit_index) {
			var str = this.parentIntClass.getString();
			this.parentIntClass.editCtrl.setText(str);
		}
		this.hasBitControls = true;
	}

	event.signal.connect(this, this.eventFunc);

}

//Update everything
CommonInt.prototype.eventFunc = function(a_event_bits) {
	this.updateControl();
	if (this.hasBitControls == true) {
		this.bitClass.updateAll();
	 }
}

CommonInt.prototype.upDownFunc = function(a_value) {
  var v = a_value;
  this.editSpin.value = 1;
  if (v > 1) {
	this.addRelative(1);
  }
  if (v < 1) {
	this.addRelative(-1);
  }
  this.updateControl();
	if (this.hasBitControls == true) {
		this.bitClass.updateAll();
	}
}

CommonInt.prototype.editTextFunc = function(a_text) {
	var index;
	var charc;
	var negative = false;
	var cursorPosition = this.editCtrl.cursorPosition;
	
	if (a_text == "-") {return;}
	if ((a_text == "-0") && (this.previousText == "0")) {return;}

	if (a_text[0] == "-") {
		negative = true;
		a_text = a_text.slice(1);
		cursorPosition--;
	 }
	for (index = 0; index < a_text.length; index++) {
		charc = this.charToValue(a_text[index]);
		if (charc < 0) {
			a_text = a_text.slice(0, index) + a_text.slice(index+1);
		}
	}
	if ((this.trailZero == true) || ((this.symmetricBase == true) && (a_text.length > this.maxCharSize))) {
		if ((cursorPosition-1) == (this.maxCharSize)) {
			a_text = a_text.substring(0, this.maxCharSize);
		} else {
			a_text = a_text.substring(0, cursorPosition) + a_text.substring(cursorPosition+1);
		}
	}
	if ((a_text == "0") && (negative == true)) {
		negative = false;
	}
	
	this.setString(a_text, negative);
	this.updateControl(a_text.length);
	this.previousText = this.editCtrl.text;
	
	if (this.hasBitControls == true) {
		this.bitClass.updateAll();
	}
}

CommonInt.prototype.listChangeFunc = function(a_index) {
	var low = a_index & 0xFF;
	Core.setByteWr(0, low);
	if (this.bitSize > 8) {
		var high = (a_index >> 8) & 0xFF;
		Core.setByteWr(1, high);
	}
  
}

CommonInt.prototype.updateControl = function(a_sourceLength) {

  if (this.usingList == false) {
	var cursorPosition = this.editCtrl.cursorPosition;
	
	var str = this.getString();
	this.editCtrl.setText(str);
	
	if (a_sourceLength != undefined) {
		if (a_sourceLength > str.length) {
			this.editCtrl.cursorPosition = cursorPosition-1;
		} else {
			this.editCtrl.cursorPosition = cursorPosition;
		}
	//if (this.editCtrl.text.length < a_text.length) {
	//	this.editCtrl.cursorPosition = cursorPosition-1;
	} else {
		this.editCtrl.cursorPosition = cursorPosition;
	}
	
	this.previousTextLength = this.editCtrl.text.length;
  } else {
	var value;
	value = Core.getByteWr(0);
	if (this.bitSize > 8) {
		value |= (Core.getByteWr(1) << 8);
	}
	if (value < this.listCtrl.count) {
		this.listCtrl.setCurrentIndex(value);
	}
  }
}

CommonInt.prototype.getString = function() {

	var str = "";

	for (index = 0; index < this.arr_size; index++) {
		this.mul_table[index] = 0;
		this.val_table[index] = 0;
	}
	this.mul_table[0] = 1;
	this.mul_table_size = 1;
	this.val_table_size = 0;
	
	var index;
	var index_b;
	var carry;
	var firstflag;
	var index;
	var index_c;
	var negative = false;
	
	 if (this.signed == true) {
		var bytev = Core.getByteWr(this.byteSize-1);
		if (bytev & 0x80) {
			negative = true;
			this.val_table[0] = 1;
		}
	 }
 
	//Reinvent the wheel
	for (index = 0; index < this.byteSize; index++) {
		index_c = (this.bigEndian == false) ? index : (this.byteSize-1-index);
		var bytev = Core.getByteWr(index_c);
		if (this.signed == true) {
			if (negative == true) {
				bytev ^= 0xFF;
			}
			if (index == (this.byteSize-1)) {
				bytev &= 0x7F;
			}
		}

		index_b = 0;
		lastNZpos = 0;
		carry = 0;
		firstflag = true;
		while ((carry > 0) || (firstflag == true) || (index_b < this.val_table_size) || (index_b < this.mul_table_size)) {
			firstflag = false;
			var a = this.val_table[index_b] + (this.mul_table[index_b] * bytev) + carry;
			  carry = Math.floor(a / this.base);
			var b = (a - (carry*this.base));
			this.val_table[index_b] = b;
			if (b > 0) {
				lastNZpos = index_b;
			}
			index_b++;
		}
		if ((lastNZpos+1) > this.val_table_size) {
			this.val_table_size = (lastNZpos+1);
		}

		index_b = 0;
		carry = 0;
		firstflag = true;
		while ((carry > 0) || (firstflag == true) || (index_b < this.mul_table_size)) {
			firstflag = false;
			var a = (this.mul_table[index_b] * 256) + carry;
			carry = Math.floor(a / this.base);
			this.mul_table[index_b] = (a - (carry*this.base));
			index_b++;
		}
		if (index_b > this.mul_table_size) {
			this.mul_table_size = index_b;
		}
	
	}

	var numof;
	if ((this.trailZero == true) && (this.base == 16)) {
		numof = (this.byteSize*2);
	} else {
		numof = this.val_table_size;
	}
	for (index = 0; index < numof; index++) {
		str = this.valueToChar(this.val_table[index]) + str;
	}
	if (negative == true) {
		str = "-" + str;
	}
	
	return str;
	
}

CommonInt.prototype.setString = function(a_string, negative) {

	var index;
	var index_b;
	var carry;
	var firstflag;
	var index;
	//var negative = false;

	this.mul_table2_size = 0;
	this.val_table2_size = 0;

	for (index = 0; index < this.byteSize; index++) {
		this.val_table2[index] = 0;
		this.mul_table2[index] = 0;
	}
	this.mul_table2[0] = 1;
	this.mul_table2_size = 1;
	this.val_table2_size = 0;

	var charc;
	var charcount = a_string.length;
	
	//Reinvent the wheel, also
	for (index = 0; index < charcount; index++) {

		charc = this.charToValue(a_string[charcount-1-index]);
		
		/*if ((charc < 0) && (this.trailZero == true)) {
			charc = 0;
		}*/

		//if (charc >= 0) {
			index_b = 0;
			carry = 0;
			firstflag = true;
			while ((carry > 0) || (firstflag == true) || (index_b < this.val_table2_size) || (index_b < this.mul_table2_size)) {
				if (index_b >= this.byteSize) {break;}
				firstflag = false;
				var a = this.val_table2[index_b] + (this.mul_table2[index_b] * charc) + carry;
				carry = Math.floor(a / 256);
				this.val_table2[index_b] = (a - (carry * 256));
				index_b++;
			}
			if (index_b > this.val_table2_size) {
				this.val_table2_size = index_b;
			}
			
			index_b = 0;
			carry = 0;
			firstflag = true;
			while ((carry > 0) || (firstflag == true) || (index_b < this.mul_table2_size)) {
				if (index_b >= this.byteSize) {break;}
				firstflag = false;
				var a = (this.mul_table2[index_b] * this.base) + carry;
				carry = Math.floor(a / 256);
				this.mul_table2[index_b] = (a - (carry*256));
				index_b++;
			}
			if (index_b > this.mul_table2_size) {
				this.mul_table2_size = index_b;
			}
		//}
	}

	carry = 1;
	for (index = 0; index < this.byteSize; index++) {
		var v = this.val_table2[index];
		if (negative) {
			v -= carry;
			if (v < 0) {
				v += 256;
				carry = 1;
			} else {
				carry = 0;
			}
			v ^= 0xFF;
		}
		if ((this.signed == true) && (index == this.byteSize-1)) {
			v &= 0x7F;
			if (negative) {v |= 0x80;}
		}
  
		var index_c = (this.bigEndian == false) ? index : (this.byteSize-1-index);
		Core.setByteWr(index_c, v);
	}

}

CommonInt.prototype.valueToChar = function(value) {
	if (value < 10) {
		return String.fromCharCode(0x30+value);
	} else if (value < 36) {
		return String.fromCharCode(0x41+(value-10));
	} else {
		return String.fromCharCode(0x21+(value-36));
	}
}

CommonInt.prototype.charToValue = function(chara) {
	var ccode = chara.charCodeAt(0);
	var value = -1;
	if ((ccode >= 0x30) && (ccode <= 0x39)) {
		value = (ccode-0x30);
	} else if ((ccode >= 0x41) && (ccode <= 0x5A)) {
		value = (ccode-0x41)+10;
	} else if ((ccode >= 0x61) && (ccode <= 0x7A)) {
		value = (ccode-0x61)+10;
	} else if ((ccode >= 0x21) && (ccode <= 0x2F)) {
		value = (ccode-0x21)+36;
	}
	if (value >= this.base) {
		value = -1;
	}
	return value;
}


CommonInt.prototype.addRelative = function(a_addVal) {
  var carry;
  var val;
  var index;
  var negative = false;
  var cap = 0;

  if (this.signed == true) {
    val = Core.getByteWr(this.byteSize-1);
    negative = ((val & 0x80) > 0) ? true : false;
  }
  carry = a_addVal;
  for (index = 0; index < this.byteSize-1; index++) {
    val = Core.getByteWr(index);
    val += carry;
    carry = (val >> 8);
    if (val < 0) {
	val += 256;
    }
    val = val & 0xFF;
    Core.setByteWr(index, val);
  }
  val = Core.getByteWr(this.byteSize-1);
  if (this.signed == true) {
	val &= 0x7F;
  }
  val += carry;
  if (this.signed == true) {
    carry = val >> 7;
    if (carry > 0) {
      if (negative == false) {
        cap = 1;
      } else {
        negative = false;
      }
    } else if (carry < 0) {
      if (negative == true) {
        cap = -1;
      } else {
        negative = true;
      }
    }
    if (val < 0) {
	val += 128;
    }
    val = val & 0x7F;
    val |= (negative == true) ? 0x80 : 0;
  } else {
    carry = (val >> 8);
    if (carry > 0) {
      cap = 1;
    } else if (carry < 0) {
      cap = -1;
    }
    val = val & 0xFF;
  }
  Core.setByteWr(this.byteSize-1, val);

  if (cap != 0) {
    for (index = 0; index < this.byteSize; index++) {
      val = Core.getByteWr(index);
      if ((index == this.byteSize-1) && (this.signed == true)) {
        val = cap < 0 ? 0x80 : 0x7F;
      } else {
        val = cap < 0 ? 0 : 0xFF;
      }
      Core.setByteWr(index, val);
    }
  }

}
