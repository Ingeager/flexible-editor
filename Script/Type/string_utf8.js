//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_string.js"

stringHandler = 0;

function init() {
	DefaultControls.init();
	
	stringHandler = new CommonString();
	stringHandler.format = "UTF-8";
	stringHandler.init();
}
