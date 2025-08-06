//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();
	
	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 8;
	palObj.channelBitSizes = [2, 2, 2];
	palObj.channelBitLSBIndex = [0, 2, 4];
	palObj.bigEndian = false;
	
	palObj.init();
}