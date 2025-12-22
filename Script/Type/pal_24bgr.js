//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();

	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 24;
	palObj.channelBitSizes = [8, 8, 8];
	palObj.channelBitLSBIndex = [16, 8, 0];
	palObj.bigEndian = false;
	
	palObj.init();
}