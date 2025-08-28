//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_int.js"

function init() {

	DefaultControls.init();
	
	intObj = new CommonInt();
	intObj.bitSize = 8;
	intObj.usingList = true;
	
	intObj.init();

}