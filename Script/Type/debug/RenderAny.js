//RenderAny.js: Render graphics from arbitrary Element, if its data type supports Render function.

//FLEX_INCLUDE "COMMON_DEFAULT.js"

ElementIx = 0;
Spin = {};
Label = {};
Bitmap = 0;

function init() {
	DefaultControls.init();
	ElementIx = Number(Core.getAttr("element_index"));

   if (Core.versionDate >= 270414) {

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
   }
   updateNewIndex();
}

function updateNewIndex() {
	if (Bitmap != 0) {
		Bitmap.hide();
	}
	Bitmap = new BitmapView(Core.window);
	Bitmap.move(Core.base_x, Core.base_y);

	var parameter = {};
	var handle = Core.initRender(ElementIx, Bitmap, parameter);
	Core.updateRender(handle, Bitmap, parameter);

	Bitmap.show();
	Bitmap.refresh();
	
	if (Core.versionDate >= 260301) {
		if (Core.hasAttr("name", ElementIx)) {
			var name = Core.getAttr("name", ElementIx);
			Label.text = '"' + name  + '"';
		} else {
			Label.text = "";
		}
	}
}

function changeUpDownFunc(a_value) {
    ElementIx = a_value;
    updateNewIndex();
}