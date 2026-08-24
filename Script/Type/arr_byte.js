//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_int.js"

function init() {
	DefaultControls.init();
	intObj = new CommonInt();
	intObj.bitSize = 8;
	intObj.init();
}

function initFetch() {
	intObj = new CommonInt();
	intObj.bitSize = 8;
	var data = intObj.fetch();
	return data;
}

function initRender(a_bitmapView, a_param) {
	intObj = new CommonInt();
	intObj.bitSize = 8;
	intObj.initRender(a_bitmapView, a_param);
}

function updateRender(a_bitmapView, a_param) {
	intObj.updateRender(a_bitmapView, a_param);
}