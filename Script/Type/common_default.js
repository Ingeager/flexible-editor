//Add default controls

DefaultControls = {}

DefaultControls.typeEdit = 0;
DefaultControls.ctrlTypeLabel = 0;
DefaultControls.ctrlAPtrLabel = 0;
DefaultControls.ctrlPtrLabel = 0;
DefaultControls.ctrlPtrEdit = 0;
DefaultControls.ctrlRelPtrLabel = 0;
DefaultControls.ctrlRelPtrEdit = 0;
DefaultControls.ctrlSepLine = 0;
DefaultControls.majorChangeFunc = 0;

DefaultControls.init = function() {
	DefaultControls.addDefault();
}

DefaultControls.addDefault = function() {
	
	DefaultControls.addTypeSelector();
	DefaultControls.addElementDefaults();
	//DefaultControls.addActivePointer();
	DefaultControls.addText();
	DefaultControls.addLine();

}

DefaultControls.addTypeSelector = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;

	var vTypeString = "BLANK";
	
	if (Core.hasAttr('type')) {
		vTypeString = Core.getAttr('type');
	}

	DefaultControls.ctrlTypeLabel = new QLabel(parentWnd);
	DefaultControls.ctrlTypeLabel.text = "Data Type:";
	DefaultControls.ctrlTypeLabel.move(x, y+4);
	DefaultControls.ctrlTypeLabel.show();

	DefaultControls.typeEdit = new QLineEdit(parentWnd);
	DefaultControls.typeEdit.setText(vTypeString);
	DefaultControls.typeEdit.readOnly = true;
	DefaultControls.typeEdit.move(x+55, y+2);
	DefaultControls.typeEdit.resize(100, 20);
	DefaultControls.typeEdit.show();
	
	/*ctrlTypeBtn = new QPushButton(parentWnd);
	ctrlTypeBtn.text = 'Change';
	ctrlTypeBtn.move(x+135, y);
	ctrlTypeBtn.show();*/
	
	Core.base_y = y + 28;
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
	Core.base_y = y + 28;
}

DefaultControls.addElementDefaults = function() {
	var parentWnd = Core.window;
	
	var x = Core.base_x;
	var y = Core.base_y;
	
	var pointerString = ""
	if (Core.hasAttr("ptr")) {
 
		DefaultControls.ctrlPtrLabel = new QLabel(parentWnd);
		DefaultControls.ctrlPtrLabel.text = 'Pointer:';
		DefaultControls.ctrlPtrLabel.move(x, y+2);
		DefaultControls.ctrlPtrLabel.show();
	
		var pointerString = Core.getAttr('ptr');
		DefaultControls.ctrlPtrEdit = new QLineEdit(parentWnd);
		DefaultControls.ctrlPtrEdit.move(x+40, y);
		DefaultControls.ctrlPtrEdit.text = "0x" + pointerString;
		DefaultControls.ctrlPtrEdit.resize(80, 20);
		DefaultControls.ctrlPtrEdit.readOnly = true;
		DefaultControls.ctrlPtrEdit.show();

		y = y + 28;
	}
	if (Core.hasAttr("relptr")) {
		DefaultControls.ctrlRelPtrLabel = new QLabel(parentWnd);
		DefaultControls.ctrlRelPtrLabel.text = 'Relative Pointer:';
		DefaultControls.ctrlRelPtrLabel.move(x, y+2);
		DefaultControls.ctrlRelPtrLabel.show();
		
		var pointerString = Core.getAttr('relptr');
		DefaultControls.ctrlRelPtrEdit = new QLineEdit(parentWnd);
		DefaultControls.ctrlRelPtrEdit.move(x+100, y);
		DefaultControls.ctrlRelPtrEdit.text = "0x" + pointerString;
		DefaultControls.ctrlRelPtrEdit.resize(80, 20);
		DefaultControls.ctrlRelPtrEdit.readOnly = true;
		DefaultControls.ctrlRelPtrEdit.show();

		y = y + 28;
	}
	Core.base_y = y;

}

/*
DefaultControls.addEventCallback = function(a_callback_func, a_callback_obj, a_flag_filter) {
 if (a_flag_filter == undefined) {
     a_flag_filter = 0xFFFFFF;
   }
   DefaultControls.callback = true;
   DefaultControls.callbackObj = a_callback_obj;
   DefaultControls.callback[ix].Func = a_callback_func;
}*/

DefaultControls.addArrayTuner = function() {

   var parentWnd = Core.window;
   var arrayCombo = false;
   var arraySlider = true;
   if (arraySlider == true) {
	DefaultControls.arrayTuner = new QSlider(parentWnd);
	DefaultControls.arrayTuner.move(Core.base_x, Core.base_y);
	DefaultControls.arrayTuner.setOrientation(1);
	DefaultControls.arrayTuner.resize(250, 20);
			
	var max = Core.getHexValueAttr("len")-1;
	DefaultControls.arrayTuner.setRange(0, max);
	DefaultControls.arrayTuner.setSingleStep(1);
	DefaultControls.arrayTuner.setPageStep(1);
	DefaultControls.arrayTuner.valueChanged.connect(this, this.arraySliderFunc);
	DefaultControls.arrayTuner.show();
	Core.base_y += 30;
   }
   if (arrayCombo == true) {
	var ctrl = new QComboBox(parentWnd);
	DefaultControls.arrayCombo = ctrl;
	ctrl.move(Core.base_x, Core.base_y);
	ctrl.resize(600, 40);
	var listId = "???";
	var listArray = Core.getList(listId);
	var ix;
	for (ix = 0; ix < listArray.length; ix++) {
		ctrl.addItem(ix.toString(16).toUpperCase() + ": " + listArray[ix]);
	}
	ctrl.show();
	Core.base_y += 30;
   }
}

DefaultControls.arraySliderFunc = function() {

    //Core.setArrayIndex(DefaultControls.arrayTuner.value);
    //event.dispatch(event.bit.changeIndex|event.bit.changeMajor);
    
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
	
	DefaultControls.ctrlSepLine = new QFrame(parentWnd);
	DefaultControls.ctrlSepLine.move(x, y);
	DefaultControls.ctrlSepLine.setFrameStyle(4);
	DefaultControls.ctrlSepLine.resize(600, 2);
	DefaultControls.ctrlSepLine.show();

	Core.base_y = y + 14;

}


