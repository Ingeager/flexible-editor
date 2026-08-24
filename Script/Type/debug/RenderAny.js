//RenderAny.js: Render graphics from arbitrary Element, if its data type supports Render function.

//FLEX_INCLUDE "COMMON_DEFAULT.js"

ElementIx = 0;
Spin = {};
Label = {};
List = {};
Bitmap = 0;
Mode = 0;

function init() {
	DefaultControls.init();
	ElementIx = Number(Core.getAttr("element_index"));

   if (Core.versionDate >= 260530) {
     List = new QComboBox(Core.window);
       var count = Core.getElementCount();
       for (var ix = 0; ix < count; ix++) {
		var name = "";
	   if (Core.versionDate >= 260701) {
		name += "<" + Core.getElementTag(ix) + "> ";
	   }
           name += "\"" + Core.getAttr("name", ix) + "\"";
           var str = ix.toString(10) + ": " + name;
           List.addItem(str);
       }
       List.setCurrentIndex(ElementIx);
       List.move(Core.base_x, Core.base_y);
       List.resize(300, 20);
	List.setStyleSheet(Core.customize("edit.stylesheet", "") + "");
       List['activated(int)'].connect(changeListFunc);
       List.editable = false;
       List.show();

       Core.base_y += (List.height + 10);
       Mode = 1;
   } else {
       Spin = new QSpinBox(Core.window);
       Spin.minimum = 0;
       Spin.maximum = 32767;
       Spin.value = ElementIx;
       Spin['valueChanged(int)'].connect(changeUpDownFunc);
	Spin.move(Core.base_x, Core.base_y);
	
	Label = new QLabel(Core.window);
	Label.move(Core.base_x+Spin.width, Core.base_y);
	Label.resize(300, 20);
	Label.show();
	
	Core.base_y += Spin.height;
   Mode = 0;
   }
   updateNewIndex();
}

function updateNewIndex() {
	if (Bitmap != 0) {
		Bitmap.hide();
	}
	
	if (Core.hasAttr("type", ElementIx) == false) {
		return;
	}
		

	Bitmap = new BitmapView(Core.window);
	Bitmap.move(Core.base_x, Core.base_y);

	var parameter = new Array(1);
	parameter[0] = {};
		/*parameter[0].dummy = "dummy";
		parameter[0].palette = new Array(1);
		parameter[0].palette[0] = 0xFF7F00;
		parameter[0].paletteentries = 1;		
		parameter[0].index = 0;*/
	var handle = Core.initRender(ElementIx, Bitmap, parameter);
	Core.updateRender(handle, Bitmap, parameter);

	Bitmap.show();
	Bitmap.refresh();
	
   if (Mode == 0) {
	if (Core.versionDate >= 260301) {
		if (Core.hasAttr("name", ElementIx)) {
			var name = Core.getAttr("name", ElementIx);
			Label.text = '"' + name  + '"';
		} else {
			Label.text = "";
		}
	}
   }
}

function changeUpDownFunc(a_value) {
    ElementIx = a_value;
    updateNewIndex();
}

function changeListFunc(a_value) {
    ElementIx = a_value;
    updateNewIndex();
}
