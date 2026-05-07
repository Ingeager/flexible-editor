//FLEX_INCLUDE "common_default.js"

function init() {
	DefaultControls.init();

	aaa = new BitmapView(Core.window);
	aaa.move(Core.base_x, Core.base_y);
	aaa.show();
	
	var data = {};
	
	var handle = Core.initRender(0, aaa, data);
	
	Core.updateRender(handle, aaa, data);

/*	var length = 64;
	var testarra = new Array(length);
	for (var a = 0; a < length; a++) {
		testarra[a] = a;
	}
	
	Core.setByteArray(0x380, testarra, length);*/
}