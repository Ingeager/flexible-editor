//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

//Regular Init
function init() {
	DefaultControls.init();
	initCommon();
	palObj.init();
}

//Fetch Init - Fetch palette as an array of RGB888.
function initFetch() {	
	initCommon();
	return(palObj.fetch());
}

function initRender(a_bitmapView, a_param) {
	initCommon();
	palObj.initRender(a_bitmapView, a_param);
}

function updateRender(a_bitmapView, a_param) {
	palObj.updateRender(a_bitmapView, a_param);
}

function initCommon() {
	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 8;
	palObj.channelBitSizes = [2, 2, 2];
	palObj.channelBitLSBIndex = [0, 2, 4];
	palObj.bigEndian = false;
}
