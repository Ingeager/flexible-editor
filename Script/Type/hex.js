//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_int.js"

function init() {

	DefaultControls.init();
	
	var len = Core.getHexValueAttr("len");

	if (len > 0) {
	
		var bitSize = len*8;
		intObj = new CommonInt(bitSize);
		
		intObj.base = 16;
		intObj.bigEndian = true;
		intObj.trailZero = true;
		intObj.arrayEnable = false;
		
		intObj.init();
		intObj.editSpin.hide();
		intObj.editCtrl.setAlignment(1);
	}
}