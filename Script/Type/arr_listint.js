//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_int.js"

function init() {

	DefaultControls.init();
	
	intObj = new CommonInt();
	intObj.usingList = true;
	
	intObj.init();

}