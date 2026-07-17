//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_string.js"

stringHandler = 0;

function init() {
	DefaultControls.init();
	
	stringHandler = new CommonString();
	stringHandler.format = "";
	stringHandler.init();
}

function initRender(a_bitmapView, a_param) {
	stringHandler = new CommonString();
	stringHandler.format = "";
	stringHandler.initRender(a_bitmapView, a_param);
}

function updateRender(a_bitmapView, a_param) {
	stringHandler.updateRender(a_bitmapView, a_param);
}