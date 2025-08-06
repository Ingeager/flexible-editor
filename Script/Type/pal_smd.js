//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();

	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 16;
	palObj.channelBitSizes = [3, 3, 3];
	palObj.channelBitLSBIndex = [9, 13, 1];
	palObj.bigEndian = false;
	//^^^ Note: SMD/Genesis Palettes are basically Big-endian.
	//CommonPalette will support that in the future.
	//For now, do Little Endian but with the strange Bit order.
	
	palObj.init();
}