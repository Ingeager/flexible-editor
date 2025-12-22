//FLEX_INCLUDE "common_default.js"

function init() {
	DefaultControls.init();

	/*for (b = 0; b < 16; b++) {
		Core.setByteAbs(0x15b300000+b, 238);
	}*/

	lab = new QLabel(Core.window);
	var size = Core.getActivePtr();
	lab.text = size.toString(16);
	lab.show();
	lab.move(Core.base_x, Core.base_y);
}