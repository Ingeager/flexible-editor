//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();

	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 16;
	palObj.channelBitSizes = [5, 5, 5];
	palObj.channelBitLSBIndex = [0, 5, 10];
	palObj.bigEndian = false;
	
	palObj.init();
}