//FLEX_INCLUDE "common_default.js"

Hex = {};

Hex.rows = 1;
Hex.totalRows = 1;
Hex.pages = 1;
Hex.currentPage = 0;
Hex.pageSize = 0x100;
Hex.rowLength = 0x10;

Hex.pageSelectSpinCtrl = 0;
Hex.editCtrl = [];
Hex.addrCtrl = [];

function init() {
    DefaultControls.init();

    //Untested
    if (Core.hasAttr("rowlength") == true) {
        Hex.rowLength = Core.getAttr("rowlength");
    }

    var len = Core.getHexValueAttr("len");
    Hex.pages = Math.ceil(len / Hex.pageSize);
    Hex.rows = Math.ceil(Hex.pageSize / Hex.rowLength)
    Hex.totalRows = Math.ceil(len / Hex.rowLength);
    Hex.currentPage = 0;

    var edit_control_x_base = 0;
    var placeAddrLabels = false;
    if (Core.versionDate >= 251202) {
        placeAddrLabels = true;
    }

    var editWidth = 500;
    for (var rowCount = 0; rowCount < Hex.rows; rowCount++) {
	//edit_control_x_base = Core.base_x;
	var verticalSpacing = 27;
        if (placeAddrLabels == true) {
            var ctrl = new QLabel(Core.window);
            Hex.addrCtrl[rowCount] = ctrl;
	         ctrl.styleSheet = "font: 16px";
            ctrl.hide();
	         //edit_control_x_base += hsize;
        }
        var ctrl = new QLineEdit(Core.window);
        Hex.editCtrl[rowCount] = ctrl;
	     ctrl.programChanged = false;
        ctrl.ctrlIndex = rowCount;
        ctrl.textChanged.connect(Hex.editCtrl[rowCount], Hex.editFunc);
	     ctrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 18px  \"Terminal\" ";
        ctrl.resize(editWidth, 28);
        ctrl.hide();
    }

    if (Hex.pages > 1) {
  
        var ctrl = new QLabel(Core.window);
        ctrl.text = "Page:";
        ctrl.move(Core.base_x, Core.base_y+440);
        ctrl.show();

        ctrl = new QSpinBox(Core.window);
        Hex.pageSelectSpinCtrl = ctrl;
        ctrl.move(Core.base_x, Core.base_y+460);
        ctrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 22px ";
        ctrl.resize(90, 35);
        ctrl.minimum = 0;
        ctrl.maximum = Hex.pages-1;
        ctrl.programChanged = true;
        ctrl.value = Hex.currentPage;
        ctrl.programChanged = false;
	ctrl['valueChanged(int)'].connect(Hex.pageChangeFunc);
        ctrl.show();
    }
   
    Hex.resetControls();
}

Hex.resetControls = function() {
   var placeAddrLabels = false;
    if (Core.versionDate >= 251202) {
        placeAddrLabels = true;
    }
    var edit_control_x_base = 0;

  var ptrbase = (Hex.currentPage*(Hex.rows*Hex.rowLength));
  for (var rowCount = 0; rowCount < Hex.rows; rowCount++) {
   if (((Hex.currentPage*Hex.rows)+rowCount) < Hex.totalRows) {
	edit_control_x_base = Core.base_x;
	var verticalSpacing = 27;
        if (placeAddrLabels == true) {
		var label = "0x" + (Core.getActivePtr() + ptrbase + (rowCount*16)).toString(16).toUpperCase();
		var ctrl = Hex.addrCtrl[rowCount];
		ctrl.move(Core.base_x, Core.base_y+4+(rowCount*verticalSpacing));
		var a = label.length;
		if (a < 5) {a = 5;}
		var hsize = (a*11)+2;
		ctrl.resize(hsize, 20);
		ctrl.text = label;
		ctrl.show();
		 edit_control_x_base += hsize;
        }
        var ctrl = Hex.editCtrl[rowCount];
	     ctrl.programChanged = false;
        ctrl.move(edit_control_x_base, Core.base_y+(rowCount*verticalSpacing));
        Hex.buildString(rowCount);
        ctrl.show();
    } else {
        Hex.addrCtrl[rowCount].hide();
        Hex.editCtrl[rowCount].hide();
    }
    }
}

Hex.pageChangeFunc = function(a_value) {
    if (Hex.pageSelectSpinCtrl.programChanged == true) {
        return;
    }

    Hex.currentPage = Hex.pageSelectSpinCtrl.value;
    Hex.resetControls();

    for (var row = 0; row < Hex.rows; row++) {
        Hex.buildString(row);
    }
}

Hex.buildString = function(a_index) {
    var totalRow = (Hex.currentPage*Hex.rows)+a_index;
    if (totalRow >= Hex.totalRows) {
        return;
    }
    var len = Core.getHexValueAttr("len");
    var base = (totalRow * Hex.rowLength);
    var sublen;
    if ((base+Hex.rowLength) <= len) {
        sublen = Hex.rowLength;
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
      if (count < (Hex.rowLength-1)) {
            str += " ";
      }
     outStr += str;
    }
    Hex.editCtrl[a_index].programChanged = true;
    Hex.editCtrl[a_index].setText(outStr);
    Hex.editCtrl[a_index].programChanged = false;

}

Hex.editFunc = function(a_newStr) {
    
    if (this.programChanged == true) {return;}

    var ctrlIndex = this.ctrlIndex;
    var totalCtrlIndex = (ctrlIndex + (Hex.currentPage*Hex.rows));
    var base = totalCtrlIndex* Hex.rowLength;
	var len = Core.getHexValueAttr("len");
    var cursorPos = this.cursorPosition;

    var sublen;
    if ((base+Hex.rowLength) <= len) {
        sublen = Hex.rowLength;
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
    var dataByteIndex = base + byteIndex;
    if ((byteIndex < sublen) && (dataByteIndex < len)) {

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
    }
    
    Hex.buildString(ctrlIndex);
    
    if ((byteIndex == (Hex.rowLength-1)) && (sub == 1) && (this.ctrlIndex < Hex.totalRows)) {
        Hex.editCtrl[this.ctrlIndex+1].setFocus();
        Hex.editCtrl[this.ctrlIndex+1].cursorPosition = 0;
    } else {
        Hex.editCtrl[this.ctrlIndex].cursorPosition = cursorPos;
    }


}