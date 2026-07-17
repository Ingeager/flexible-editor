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
	palObj.indexed = true;
	palObj.indexedPalette = Core.NESPalette;
	palObj.indexedPaletteSize = 64;
	palObj.bitSize = 8;
	palObj.bigEndian = false;
	
	palObj.getIndexedRGB = function(index) {
		return(CommonPalette.prototype.getIndexedRGB.call(this, index & 0x3F));
	}
}
