//FLEX_INCLUDE "common_default.js"

Hex = {};

Hex.rows = 1;

//Hex.editCtrl = [];

function init() {
    DefaultControls.init();

    var len = Core.getHexValueAttr("len");
    var rows = Math.ceil(len / 16);

    if (rows < 0) {
        rows = 1;
    }
 /*   if (rows > 24) {
        rows = 24;
    }*/
    Hex.rows = rows;

   Hex.editCtrl = [];

    var edit_control_x_base = 0;
    var placeAddrLabels = false;
    if (Core.versionDate >= 251111) {
        placeAddrLabels = true;
    }

    for (var rowCount = 0; rowCount < rows; rowCount++) {
	edit_control_x_base = Core.base_x;
	var verticalSpacing = 27;
        if (placeAddrLabels == true) {
            var label = "0x" + (Core.getActivePtr() + (rowCount*16)).toString(16).toUpperCase();
            var ctrl = new QLabel(Core.window);
            ctrl.move(Core.base_x, Core.base_y+4+(rowCount*verticalSpacing));
	    var hsize = (label.length*11)+2;
            ctrl.resize(hsize, 20);
            ctrl.text = label;
	    ctrl.styleSheet = "font: 16px ";
            ctrl.show();
	    edit_control_x_base += hsize;
        }
        var ctrl = new QLineEdit(Core.window);
	ctrl.programChanged = false;
        ctrl.ctrlIndex = rowCount;
        Hex.editCtrl[rowCount] = ctrl;
        ctrl.textChanged.connect(Hex.editCtrl[rowCount], editFunc);
        ctrl.move(edit_control_x_base, Core.base_y+(rowCount*verticalSpacing));
	ctrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 18px  \"Terminal\" ";
        ctrl.resize(500, 28);
        buildString(rowCount);
        ctrl.show();
    }
   
}

function buildString(a_index) {
    if (a_index >= Hex.rows) {
        return;
    }
    var len = Core.getHexValueAttr("len");
    var base = (a_index * 16);
    var sublen;
    if ((base+16) <= len) {
        sublen = 16;
    } else {
        sublen = (len - base);
    }
    var outStr = "";
    var count;
    for (count = 0; count < sublen; count++) {
        var bv = Core.getByte(base + count);
        var str = bv.toString(16).toUpperCase();
        if (str.length < 2) {
            str = "0" + str;
        }
      if (count < 15) {
            str += " ";
      }
     outStr += str;
    }
    Hex.editCtrl[a_index].programChanged = true;
    Hex.editCtrl[a_index].setText(outStr);
    Hex.editCtrl[a_index].programChanged = false;

}

function editFunc(a_newStr) {
    // Game plan:
    // Let's only read one character for now.
    // Also, refresh text after.
    
    if (this.programChanged == true) {return;}

    var ctrlIndex = this.ctrlIndex;

    var cursorPos = this.cursorPosition;

    var len = Core.getHexValueAttr("len");
    var base = (ctrlIndex * 16);
    var sublen;
    if ((base+16) <= len) {
        sublen = 16;
    } else {
        sublen = (len - base);
    }
    var textlength;
    if (sublen == 1) {
	textlength = 2;
    } else {
	textlength = ((sublen-1)*3)+2;
    }
    
    if (this.text.length >= textlength) {

    var byteIndex = 0;
    var lineChar = cursorPos-1;
    var sub = 0;
    if (lineChar < 2) {
        byteIndex = 0;
        sub = lineChar;
        if (sub == 1) {cursorPos++;}
    } else {
        byteIndex = Math.floor((lineChar - 2) / 3)+1;
        var subchar = ((lineChar - 2) % 3);
        if (subchar == 2) {cursorPos++;}
        sub = subchar >> 1;
    }
    var dataByteIndex = byteIndex + (ctrlIndex*16);
    var value = Core.getByte(dataByteIndex);

   var ccode = this.text.charCodeAt(lineChar);
   var valid = true;
   var newval = 0;
	if ((ccode >= 0x30) && (ccode <= 0x39)) {
		newval = (ccode-0x30);
	} else if ((ccode >= 0x41) && (ccode <= 0x46)) {
		newval = (ccode-0x41)+10;
	} else if ((ccode >= 0x61) && (ccode <= 0x66)) {
		newval = (ccode-0x61)+10;
    } else {
      valid = false;
    }
    if (valid == true) {
        value &= (0xF << (sub * 4));
        value |= (newval << ((1 - sub) * 4));
        Core.setByte(dataByteIndex, value);
    }
    }

    buildString(ctrlIndex);
    
    if ((byteIndex == 15) && (sub == 1) && (this.ctrlIndex < Hex.rows)) {
        Hex.editCtrl[this.ctrlIndex+1].setFocus();
        Hex.editCtrl[this.ctrlIndex+1].cursorPosition = 0;
    } else {
        Hex.editCtrl[this.ctrlIndex].cursorPosition = cursorPos;
    }


}