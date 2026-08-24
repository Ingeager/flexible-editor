//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_stringrender.js"
//FLEX_INCLUDE "common_bit.js"

BitValue = {};

BitValue.dataLen = 1;
BitValue.entryBitSpacing = 8;
BitValue.entryBitSize = 8;
BitValue.entryBitStart = 0;
BitValue.base = 10;
BitValue.index = 0;
BitValue.previousTextLength = -1;
BitValue.previousText = "";

BitValue.editCtrl = 0;
BitValue.editSpin = 0;
BitValue.listCtrl = 0;
BitValue.statusCtrl = 0;
BitValue.usingList = false;
BitValue.bitSizeCtrl = 0;
BitValue.bitSpacingCtrl = 0;
BitValue.bitOffsetCtrl = 0;
BitValue.byteOffsetCtrl = 0;
BitValue.hasBitControls = false;
BitValue.bitClass = {};


function init() {
    DefaultControls.init();
    BitValue.initCommon();

//    BitValue.test();

     BitValue.initCtrl();
}

function initFetch() {
    BitValue.initCommon();

    var datas = [];
    for (var i = 0; i < BitValue.dataLen; i++) {
        var v = BitValue.getValue(i);
        datas.push(v);
    }

    return datas;
}

function initRender(a_bmv, a_param) {
    BitValue.initCommon();
    if (a_bmv.initialized == false) {
        //var maxvalue = (1 << BitValue.entryBitSize) - 1;
        //var max_string = maxvalue.toString(BitValue.base);
	var datastring = "";
             for (var dataix = 0; dataix < BitValue.dataLen; dataix++) {
                 BitValue.index = dataix;
                 datastring += BitValue.getString();
                 if ((dataix+1) < BitValue.dataLen) {
                     datastring += ",";
                 }
             }

        CommonStringRender.initBMV(a_bmv, datastring.length, (4*5), (6*5));
    }
}

function updateRender(a_bmv, a_param) {
    
    var params = [];
    if (Array.isArray(a_param) == true) {
        params = a_param;
    } else {
        params.push(a_param);
    }

    for (var ix = 0; ix < params.length; ix++) {
        var datastring = "";
        var v_param = params[ix];
        
        if (v_param.hasOwnProperty("index") == true) {
             BitValue.index = Number(v_param.index);
             datastring = BitValue.getString();
        } else {
             for (var dataix = 0; dataix < BitValue.dataLen; dataix++) {
                 BitValue.index = dataix;
                 datastring += BitValue.getString();
                 if ((dataix+1) < BitValue.dataLen) {
                     datastring += ",";
                 }
             }
        }

        CommonStringRender.drawStringParam(datastring, a_bmv, v_param, 4*5, 6*5);
    }
}

BitValue.initCommon = function() {
    var dataLength = 1;
    if (Core.hasAttr("len") == true) {
        dataLength = Core.getHexValueAttr("len");
    }
    BitValue.dataLen = dataLength;
    
    if (Core.hasAttr("base") == true) {
        BitValue.base = Number(Core.getAttr("base"));
    }
    
   if (Core.hasAttr("size")) {
        BitValue.entryBitSize = Number(Core.getAttr("size"));
    }
   if (Core.hasAttr("spacing")) {
        BitValue.entryBitSpacing = Number(Core.getAttr("spacing"));
    } else {
        BitValue.entryBitSpacing = BitValue.entryBitSize;
    }
   if (Core.hasAttr("startpos")) {
        BitValue.entryBitStart = Number(Core.getAttr("startpos"));
    }

}

BitValue.initCtrl = function() {

	var parentWnd = Core.window;

       if (BitValue.dataLen > 1) {
            DefaultControls.addArrayTuner();
	    if (Core.versionDate >= 250823) {
		Core.setArrayByteSize(0);  // handle arrays internally
		BitValue.index = Core.getArrayIndex();	//Set to cached value from the editor
	    }
        }

	if (Core.hasAttr("list") == true) {
		BitValue.usingList = true;
	}

	if (BitValue.usingList == false) {		
		BitValue.editCtrl = new QLineEdit(parentWnd);
		BitValue.editCtrl.move(Core.base_x, Core.base_y);
		var fontpx = 17;
		var ctrlHeight = 40;
	/*	var modifier = 0.7;
		var maxChar2 = BitValue.maxCharSize;*/
	//	ctrlWidth = (Math.floor(maxChar2 * fontpx * modifier) + 15);
		ctrlWidth = 90;
	/*	if (ctrlWidth >= 600) {
			ctrlWidth = 600;
		}*/

		var addtext = "; font-size: " + fontpx + "px";
		BitValue.editCtrl.setStyleSheet(Core.customize("edit.stylesheet", "") + addtext);
		BitValue.editCtrl.setAlignment(2);
		BitValue.editCtrl.resize(ctrlWidth, ctrlHeight);
		BitValue.editCtrl.textEdited.connect(BitValue.editTextFunc);
		
		BitValue.editCtrl.show();

		BitValue.editSpin = new QSpinBox(parentWnd);
		BitValue.editSpin.move(Core.base_x+ctrlWidth, Core.base_y);
		BitValue.editSpin.resize(15, ctrlHeight);
		BitValue.editSpin.minimum = 0;
		BitValue.editSpin.maximum =  (1 << BitValue.entryBitSize)-1;
		BitValue.editSpin.value = BitValue.getValue(BitValue.index);
		BitValue.editSpin.singleStep = 1;
		BitValue.editSpin['valueChanged(int)'].connect(BitValue.upDownFunc);
		BitValue.editSpin.show();

		Core.base_y += ctrlHeight + 10;
      } else {
          // usingList == true
	      //Editing using List / QComboBox
		
		BitValue.listCtrl = new QComboBox(parentWnd);
		BitValue.listCtrl.move(Core.base_x, Core.base_y);
		BitValue.listCtrl.resize(600, 40);
		var listId = Core.getAttr("list");
		var listArray = Core.getList(listId);
		for (var ix = 0; ix < listArray.length; ix++) {
			BitValue.listCtrl.addItem(ix.toString(16).toUpperCase() + ": " + listArray[ix]);
		}

		BitValue.listCtrl.editable = false;
		BitValue.listCtrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 25px";
		BitValue.listCtrl['activated(int)'].connect(BitValue.listChangeFunc);
		BitValue.listCtrl.show();

		Core.base_y += 45;
		
		BitValue.statusCtrl = BitValue.addLabel("");
		
		//Core.base_y += BitValue.statusCtrl.height;

      }

	if (Core.hasAttr("bit") == true) {
		BitValue.bitClass = new CommonBit();
		BitValue.bitClass.updateCtrl = function(a_ix) {
			var currentBit = (BitValue.index * BitValue.entryBitSpacing) + BitValue.entryBitStart + (BitValue.entryBitSize-1) - a_ix;
			var byteix = currentBit >> 3;
			var bytevalue = Core.getByte(byteix);
			var boolvalue = (((bytevalue >> (currentBit&7))&1) == 1);
			this.ctrl[a_ix].programChanged = true;
			this.ctrl[a_ix].setChecked(boolvalue);
			this.ctrl[a_ix].programChanged = false;
		}
		BitValue.bitClass.setCheckFunc = function(a_state) {
			var thisRef = this.thisRef;
			var ix = this.index;
			if (thisRef.ctrl[ix].programChanged == true) {return;}
			var bitv = (a_state > 0) ? 1 : 0;
			//var byte_ix = thisRef.bit_ix[ix] >> 3;
			var value_sub_bit = thisRef.bit_ix[ix];
			var currentBit = (BitValue.index * BitValue.entryBitSpacing) + BitValue.entryBitStart + value_sub_bit;
			var byte_ix = currentBit >> 3;
			var sub_bit = currentBit & 7;
			var bytev = Core.getByte(byte_ix);
			bytev &= (0xFF ^ (1 << sub_bit));
			bytev |= (bitv << sub_bit);
			Core.setByte(byte_ix, bytev);
			//thisRef.changeFunc(sub_bit);
			if (BitValue.usingList == false) {
				BitValue.editSpin.value = BitValue.getValue(BitValue.index);
			}
			BitValue.updateString();
		}
		BitValue.bitClass.initBitAttr(BitValue.entryBitSize);
		//this.bitClass.parentClass = this;
		//this.bitClass.changeFunc = function(a_bit_index) {
			//this.parentIntClass.updateControl();
		//}
		BitValue.hasBitControls = true;
		Core.base_y += 12;
	}


      BitValue.bitSizeCtrl = BitValue.addLabel("Value bit size: " +  BitValue.entryBitSize);
      if (BitValue.entryBitSize != BitValue.entryBitSpacing) {
           BitValue.bitSpacingCtrl = BitValue.addLabel("Value bit spacing: " + BitValue.entryBitSpacing);
       }

       if (BitValue.dataLen > 1) {
		//if (Core.versionDate >= 250823) {
		    BitValue.bitOffsetCtrl = BitValue.addLabel("Bit offset: 0");
		    BitValue.byteOffsetCtrl = BitValue.addLabel("Byte offset: 0");
		//} else {
		//	var ctrl = BitValue.addLabel("(Arrays not supported, needs newer version)");
		//}
        }
	

      BitValue.updateString();


	if (Core.versionDate < 250823) {
		event.signal.connect(BitValue.eventFunc);
	} else {
		Event.signal.connect(BitValue.eventFunc);
	}
}

BitValue.addLabel = function(a_str) {
      var labelCtrl;
       var h = 30;
      labelCtrl = new QLabel(Core.window);
		labelCtrl.move(Core.base_x, Core.base_y);
		labelCtrl.resize(600, h);
		labelCtrl.text = a_str;
		labelCtrl.styleSheet = "font: 16px";
		labelCtrl.show();

      Core.base_y += (h + 5);
      return( labelCtrl );
}


BitValue.editTextFunc = function(a_text) {
	var index;
	var charc;
	var negative = false;
	var cursorPosition = BitValue.editCtrl.cursorPosition;
	
	/*if (a_text == "-") {return;}
	if ((a_text == "-0") && (BitValue.previousText == "0")) {return;}

	if (a_text[0] == "-") {
		negative = true;
		a_text = a_text.slice(1);
		cursorPosition--;
	 }
	for (index = 0; index < a_text.length; index++) {
		charc = BitValue.charToValue(a_text[index]);
		if (charc < 0) {
			a_text = a_text.slice(0, index) + a_text.slice(index+1);
		}
	}*/

	/*if (a_text.length > BitValue.maxCharSize) {
		if ((cursorPosition-1) == (BitValue.maxCharSize)) {
			a_text = a_text.substring(0, BitValue.maxCharSize);
		} else {
			a_text = a_text.substring(0, cursorPosition) + a_text.substring(cursorPosition+1);
		}
	}*/
	/*if ((a_text == "0") && (negative == true)) {
		negative = false;
	}*/

   BitValue.setString(a_text);
	BitValue.updateString(a_text.length);
	BitValue.previousText = BitValue.editCtrl.text;

   BitValue.editSpin.value = BitValue.getValue(BitValue.index);
	
    if (BitValue.hasBitControls == true) {
	BitValue.bitClass.updateAll();
    }

}

BitValue.upDownFunc = function(a_value) {
    BitValue.setValue(BitValue.index, a_value);
    BitValue.updateString();
    if (BitValue.hasBitControls == true) {
	BitValue.bitClass.updateAll();
    }
}

BitValue.listChangeFunc = function(a_value) {

	BitValue.setValue(BitValue.index, a_value);
	BitValue.statusCtrl.text = "";

	if (BitValue.hasBitControls == true) {
		BitValue.bitClass.updateAll();
	}
}


BitValue.eventFunc = function(a_eventBits) {
	if (Core.versionDate >= 250823) {
		BitValue.index = Core.getArrayIndex();
	} else {
		BitValue.index = Core.arrayIndex;
	}
    if (BitValue.usingList == false) {
        BitValue.editSpin.value = BitValue.getValue(BitValue.index);
    }
    BitValue.updateString();

    if (BitValue.hasBitControls == true) {
	BitValue.bitClass.updateAll();
    }

    var bitoffset = BitValue.entryBitStart +  (BitValue.index * BitValue.entryBitSpacing);
    var byteoffset = bitoffset >> 3;
    BitValue.bitOffsetCtrl.text = "Bit offset: " + bitoffset;
    BitValue.byteOffsetCtrl.text = "Byte offset: " + byteoffset;
    
    if (Core.versionDate >= 251202) {
	if (typeof DefaultControls.ctrlAPtrEdit == "object") {
		//Directly update the default control "Active Pointer" display from here.
		var activePtr = Core.getActivePtr() + byteoffset;
		DefaultControls.ctrlAPtrEdit.text = "0x" + activePtr.toString(16).toUpperCase();
	}
    }
}

BitValue.updateString = function(a_sourceLength) {

  if (BitValue.usingList == false) {
	var cursorPosition = BitValue.editCtrl.cursorPosition;
	
	var str = BitValue.getString();
	BitValue.editCtrl.setText(str);
	
	if (a_sourceLength != undefined) {
		if (a_sourceLength > str.length) {
			BitValue.editCtrl.cursorPosition = cursorPosition-1;
		} else {
			BitValue.editCtrl.cursorPosition = cursorPosition;
		}
	//if (BitValue.editCtrl.text.length < a_text.length) {
	//	BitValue.editCtrl.cursorPosition = cursorPosition-1;
	} else {
		BitValue.editCtrl.cursorPosition = cursorPosition;
	}
	
	BitValue.previousTextLength = BitValue.editCtrl.text.length;


   } else {
       // BitValue.usingList == true;

   var value = BitValue.getValue(BitValue.index);

	if (value < BitValue.listCtrl.count) {
		BitValue.listCtrl.setCurrentIndex(value);
		BitValue.statusCtrl.text = "";
	} else {
		BitValue.listCtrl.setCurrentIndex(0);
		BitValue.statusCtrl.text = "Warning: Input value is larger than list size!";
	}
   }

}

BitValue.getString = function() {
    var num = BitValue.getValue(BitValue.index);
    var str = num.toString(BitValue.base);
    return(str);
}

BitValue.setString = function(a_str) {
    var num = parseInt(a_str, BitValue.base);
    if (isNaN(num) == true) {num = 0;}
    var max = (1 << BitValue.entryBitSize)-1;
    if (num < 0) {num = 0;}
    if (num > max) {num = max;}
    BitValue.setValue(BitValue.index, num);
}


BitValue.test = function() {
//	print("---");
//	     print(Core.getByte(0));
    var arrarr = new Array(256);
    for (var bs = 1; bs < 32; bs++) {
    for (var spacing = 0; spacing < 32; spacing++) {
     BitValue.entryBitSpacing = bs + spacing;
     BitValue.entryBitSize = bs;
    for (var dir = 0; dir < 2; dir++) {
    
    for (var ix = 0; ix < 256; ix++) {
        var value = Math.random() *  (1 << bs);
        var value2 = Math.floor(value) & ((1 << bs) -1);
     //   print("v: " + value + "  -  v2: " + value2);
        var ixb = (dir == 0) ? ix : 255-ix;
        BitValue.setValue(ixb, value2);
        arrarr[ixb] = value2;
    }
    for (var ix = 0; ix < 256; ix++) {
         var value3 = BitValue.getValue(ix);
         if (value3 != arrarr[ix]) {
             print("test error: bit size " + bs + " - index: " + ix + " - write: " + arrarr[ix] + " - read: " + value3 + " - dir: "+ dir);
//	     print(Core.getByte(0));
             return;//
         }
    }
    }
    }
	}
}

BitValue.getValue = function(a_index) {
    var currentBit = (a_index * BitValue.entryBitSpacing) + BitValue.entryBitStart;
    var value = 0;
    var bytevalue = 0;
    var readbyte = true;
    for (var i = 0; i < BitValue.entryBitSize; i++) {
        if (readbyte) {
            var byteix = currentBit >> 3;
            bytevalue = Core.getByte(byteix);
         }
         value = value + (((bytevalue >> (currentBit&7))&1) << i);
         currentBit++;
         if ((currentBit&7) == 0) {
             readbyte = true;
         } else {
             readbyte = false;
         }
    }
    return value;
}

BitValue.setValue = function(a_index, a_value) {
//	print("a_value:" + a_value);
   var currentBit = (a_index * BitValue.entryBitSpacing) + BitValue.entryBitStart;
   var bytevalue = 0;
   var readbyte = true;
    for (var i = 0; i < BitValue.entryBitSize; i++) {
       if (readbyte) {
           var byteix = currentBit >> 3;
           bytevalue = Core.getByte(byteix);
       }
       bytevalue = bytevalue & ((1<<(currentBit&7))^0xFF);
       bytevalue |= (((a_value >> i) & 1) << (currentBit&7));
       currentBit++;
       if (((currentBit&7) == 0) || ((i+1) == BitValue.entryBitSize)) {
    //          print("bv: " + bytevalue);
//	      print("byteix:" + byteix);
           var byteix = (currentBit-1)>>3;
           Core.setByte(byteix, bytevalue);
           readbyte = true;
       } else {
           readbyte = false;
       }
    }

}
