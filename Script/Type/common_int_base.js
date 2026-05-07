//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_int.js"

//INTEGER_BIT_SIZE must be set somewhere in the global scope
//of the script that includes this one.

function init() {
	DefaultControls.init();
	intObj = new CommonInt();
	intObj.bitSize = INTEGER_BIT_SIZE;
	intObj.init();
}

function initFetch() {
	intObj = new CommonInt();
	intObj.bitSize = INTEGER_BIT_SIZE;
	var data = intObj.fetch();
	return data;
}

function initRender(a_bitmapView, a_param) {
	intObj = new CommonInt();
	intObj.bitSize = INTEGER_BIT_SIZE;
	intObj.initRender(a_bitmapView, a_param);
}

function updateRender(a_bitmapView, a_param) {
	intObj.updateRender(a_bitmapView, a_param);
}