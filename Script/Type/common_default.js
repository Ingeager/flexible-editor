//Add default controls

DefaultControls = {}

DefaultControls.typeEdit = 0;
DefaultControls.ctrlTypeLabel = 0;
DefaultControls.ctrlAPtrLabel = 0;
DefaultControls.ctrlPtrLabel = 0;
DefaultControls.ctrlPtrEdit = 0;
DefaultControls.ctrlRelPtrLabel = 0;
DefaultControls.ctrlRelPtrEdit = 0;
DefaultControls.ctrlCommonEdit = 0;
DefaultControls.ctrlArrayCombo = 0;
DefaultControls.ctrlArraySpinBox = 0;
DefaultControls.majorChangeFunc = 0;

DefaultControls.init = function() {
	DefaultControls.addDefault();
}

DefaultControls.addDefault = function() {

	var back_y = Core.base_y;
	var back_x = Core.base_x;
	
	DefaultControls.addType();
	DefaultControls.addElementDefaults();
	//DefaultControls.addActivePointer();
	DefaultControls.addCommon();

	var back_y2 = Core.base_y;
	var back_x2 = Core.base_x;
	Core.base_x += 220;
	Core.base_y = back_y;
	DefaultControls.addFlags();
	Core.base_x = back_x2;
	
	if (Core.base_y < back_y2) {
		Core.base_y = back_y2;
	}

	DefaultControls.addText();
	DefaultControls.addLine();

}

DefaultControls.addType = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;

	var vTypeString = "BLANK";
	
	if (Core.hasAttr("type")) {
	 	vTypeString = Core.getAttr("type");
	}

	DefaultControls.ctrlTypeLabel = new QLabel(parentWnd);
	DefaultControls.ctrlTypeLabel.text = "Data Type:";
	DefaultControls.ctrlTypeLabel.move(x, y+2);
	DefaultControls.ctrlTypeLabel.show();

	DefaultControls.typeEdit = new QLineEdit(parentWnd);
	DefaultControls.typeEdit.setText(vTypeString);
	DefaultControls.typeEdit.readOnly = true;
	DefaultControls.typeEdit.move(x+55, y);
	DefaultControls.typeEdit.resize(100, 20);
	DefaultControls.typeEdit.show();
	
	Core.base_y = y + 26;
}

DefaultControls.addActivePointer = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;
	
	DefaultControls.ctrlAPtrLabel = new QLabel(parentWnd);
	DefaultControls.ctrlAPtrLabel.text = 'Active Pointer:';
	DefaultControls.ctrlAPtrLabel.move(x, y+3);
	DefaultControls.ctrlAPtrLabel.show();

	DefaultControls.ctrlPtrEdit = new QLineEdit(parentWnd);
	DefaultControls.ctrlPtrEdit.setText('0x0');
	DefaultControls.ctrlPtrEdit.readOnly = true;
	DefaultControls.ctrlPtrEdit.move(x+75, y);
	DefaultControls.ctrlPtrEdit.resize(80, 20);
	DefaultControls.ctrlPtrEdit.show();

	Core.base_x = 15;
	Core.base_y = y + 26;
}

DefaultControls.addElementDefaults = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;
	
	var pointerString = ""
	if (Core.hasAttr("ptr")) {
 
		DefaultControls.ctrlPtrLabel = new QLabel(parentWnd);
		DefaultControls.ctrlPtrLabel.text = "Pointer:";
		DefaultControls.ctrlPtrLabel.move(x, y+2);
		DefaultControls.ctrlPtrLabel.show();
	
		var pointerString = Core.getAttr("ptr");
		DefaultControls.ctrlPtrEdit = new QLineEdit(parentWnd);
		DefaultControls.ctrlPtrEdit.move(x+40, y);
		DefaultControls.ctrlPtrEdit.text = "0x" + pointerString;
		DefaultControls.ctrlPtrEdit.resize(80, 20);
		DefaultControls.ctrlPtrEdit.readOnly = true;
		DefaultControls.ctrlPtrEdit.show();

		y = y + 26;
	}
	if (Core.hasAttr("relptr")) {
		DefaultControls.ctrlRelPtrLabel = new QLabel(parentWnd);
		DefaultControls.ctrlRelPtrLabel.text = "Relative Pointer:";
		DefaultControls.ctrlRelPtrLabel.move(x, y+2);
		DefaultControls.ctrlRelPtrLabel.show();
		
		var pointerString = Core.getAttr("relptr");
		DefaultControls.ctrlRelPtrEdit = new QLineEdit(parentWnd);
		DefaultControls.ctrlRelPtrEdit.move(x+85, y);
		DefaultControls.ctrlRelPtrEdit.text = "0x" + pointerString;
		DefaultControls.ctrlRelPtrEdit.resize(80, 20);
		DefaultControls.ctrlRelPtrEdit.readOnly = true;
		DefaultControls.ctrlRelPtrEdit.show();

		y = y + 26;
	}
	Core.base_y = y;

}

DefaultControls.addFlags = function() {

  if (Core.hasAttr("flag") == false) {
    return;
  }
  var ctrl;
  var showStr;
  var flagStr;
  var parentWnd = Core.window;

  ctrl = new QLabel(parentWnd);
  ctrl.text = "Flags:";
  ctrl.move(Core.base_x, Core.base_y);
  ctrl.resize(80, 20);
  
  ctrl.show();

  flagStr = Core.getAttr("flag");

 // if (Core.versionDate >= 250907) {
 
	ctrl = new QPlainTextEdit(parentWnd);
	DefaultControls.flagList = ctrl;
	ctrl.move(Core.base_x+35, Core.base_y+0);
	ctrl.resize(100, 55);

	showStr = flagStr.replace(".", "\n");
	ctrl.setPlainText(showStr);
	ctrl.readOnly = true;
	ctrl.show();

	Core.base_y += 65;

 //Multi-control version
 /* } else {
	showStr = flagStr.split(".");
	var ix;
	for (ix = 0; ix < showStr.length; ix++) {
		ctrl = new QLineEdit(parentWnd);
		ctrl.move(Core.base_x+35, Core.base_y+0);
		ctrl.resize(100, 21);

		ctrl.text = showStr[ix];
		ctrl.readOnly = true;
		ctrl.show();

		Core.base_y += 20;
	}
	Core.base_y += 10;
  }*/
}


DefaultControls.addArrayTuner = function() {

   var parentWnd = Core.window;

   var ctrl;
   ctrl = new QLabel(parentWnd);
   ctrl.text = "Index:";
   ctrl.resize(45, 20);
   ctrl.move(Core.base_x, Core.base_y);
   ctrl.show();
   var backupX = Core.base_x;
   Core.base_x += ctrl.width;

   var arrayCombo = false;
   var arraySlider = true;
   if ((Core.hasAttr("arrindex_lablist") == true) || (Core.hasAttr("arrindex_labdef") == true)) {
       arrayCombo = true;
       arraySlider = false;
   }

	var currentIndex = 0;
	if (Core.versionDate >= 250823) {
		currentIndex = Core.getArrayIndex();
	}

	var max = Core.getHexValueAttr("len")-1;

   if (arraySlider == true) {
	DefaultControls.arrayTuner = new QSlider(parentWnd);
	DefaultControls.arrayTuner.move(Core.base_x, Core.base_y);
	DefaultControls.arrayTuner.setOrientation(1);
	DefaultControls.arrayTuner.resize(300, 20);

	DefaultControls.arrayTuner.setRange(0, max);
	DefaultControls.arrayTuner.setSingleStep(1);
	DefaultControls.arrayTuner.setPageStep(1);
	DefaultControls.arrayTuner.valueChanged.connect(this, this.arraySliderFunc);
	DefaultControls.arrayTuner.programChanged = true;
	DefaultControls.arrayTuner.value = currentIndex;
	DefaultControls.arrayTuner.programChanged = false;
 	DefaultControls.arrayTuner.show();

	ctrl = new QSpinBox(parentWnd);
	DefaultControls.ctrlArraySpinBox = ctrl;
	ctrl.minimum = 0;
	ctrl.maximum = max;
	ctrl.value = currentIndex;
	ctrl.programChanged = false;
	ctrl.resize(55, 25);
	ctrl.styleSheet = "font: 15px";
	ctrl.move(Core.base_x+DefaultControls.arrayTuner.width + 15, Core.base_y);
	ctrl['valueChanged(int)'].connect(this, this.arraySpinBoxFunc);
	ctrl.show();
	Core.base_y += 30;
   }
   if (arrayCombo == true) {
	var ctrl = new QComboBox(parentWnd);
	DefaultControls.ctrlArrayCombo = ctrl;
	ctrl.move(Core.base_x, Core.base_y);
	ctrl.styleSheet = "font: 25px";
	ctrl.resize(550, 40);
	var listArray;
	if (Core.hasAttr("arrindex_lablist") == true) {
		var listId = Core.getAttr("arrindex_lablist");
		listArray = Core.getList(listId);
	} else {
		//has ARRINDEX_LABDEF
		var labdef = Core.getAttr("arrindex_labdef");
		listArray = labdef.split(".");
	}
	var ix;
	var itemStr = "";
	for (ix = 0; ix <= max; ix++) {
		if (ix < listArray.length) {
			itemStr = listArray[ix];
		} else {
			itemStr = "?";
		}
		ctrl.addItem(ix.toString(16).toUpperCase() + ": " + itemStr);
	}
	ctrl.setCurrentIndex(currentIndex);
	ctrl['currentIndexChanged(int)'].connect(DefaultControls.arrayComboFunc);
	ctrl.show();
	
	Core.base_y += 50;
   }

	Core.base_x = backupX;
	DefaultControls.addLine();
}

DefaultControls.arraySliderFunc = function() {
	if (DefaultControls.arrayTuner.programChanged == true) {
		return;
	}

	if (Core.versionDate >= 250823) {
		Core.setArrayIndex(DefaultControls.arrayTuner.value);
		Event.dispatch(Event.bit.changeIndex);
	} else {
		Core.arrayIndex = DefaultControls.arrayTuner.value;
		event.dispatch(event.bit.changeindex);
	}
	DefaultControls.ctrlArraySpinBox.programChanged = true;
	DefaultControls.ctrlArraySpinBox.value = DefaultControls.arrayTuner.value;
	DefaultControls.ctrlArraySpinBox.programChanged = false;
}

DefaultControls.arraySpinBoxFunc = function(a_value) {
	if (DefaultControls.ctrlArraySpinBox.programChanged == true) {
		return;
	}

 	if (Core.versionDate >= 250823) {
	  	Core.setArrayIndex(a_value);
	  	Event.dispatch(Event.bit.changeIndex);
	 } else {
		Core.arrayIndex = a_value;
		event.dispatch(event.bit.changeindex);
	}
	DefaultControls.arrayTuner.programChanged = true;
	DefaultControls.arrayTuner.value = a_value;
	DefaultControls.arrayTuner.programChanged = false;
}

DefaultControls.arrayComboFunc = function(a_value) {
 	if (Core.versionDate >= 250823) {
	  	Core.setArrayIndex(a_value);
	  	Event.dispatch(Event.bit.changeIndex);
	 } else {
		Core.arrayIndex = a_value;
		event.dispatch(event.bit.changeindex);
	}
}

DefaultControls.addCommon = function() {
  if (Core.hasAttr("common") == true) {
    var parentWnd = Core.window;
    var ctrl = new QLabel(parentWnd);
    ctrl.text = "Common:";
    ctrl.resize(90, 20);
    ctrl.move(Core.base_x, Core.base_y);
    ctrl.show();

    ctrl = new QLineEdit(parentWnd);
    DefaultControls.ctrlCommonEdit = ctrl;
	ctrl.text = Core.getAttr("common");
    ctrl.move(Core.base_x + 48, Core.base_y);
    ctrl.resize(100, 20);
    ctrl.readOnly = true;
    ctrl.show();

    Core.base_y += 26;
  }
}

DefaultControls.addText = function() {
	
	if (Core.hasText() == true) {
		var parentWnd = Core.window;
		var y = Core.base_y;
		var x = Core.base_x;
		
		var text = Core.getText();
		DefaultControls.textCtrl = new QLineEdit(parentWnd);
		DefaultControls.textCtrl.move(x, y);
		DefaultControls.textCtrl.text = text;
		DefaultControls.textCtrl.resize(600, 20);
		DefaultControls.textCtrl.readOnly = true;
		DefaultControls.textCtrl.show();

		Core.base_y = y + 28;
	}
}

DefaultControls.addLine = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;
	
	ctrl = new QFrame(parentWnd);
	ctrl.move(x, y);
	ctrl.setFrameStyle(4);
	ctrl.resize(600, 2);
	ctrl.show();

	Core.base_y = y + 12;
}


