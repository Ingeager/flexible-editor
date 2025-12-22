//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();

	palObj = new CommonPalette();
	palObj.indexed = false;
	palObj.bitSize = 16;
	palObj.channelBitSizes = [3, 3, 3];
	if (Core.versionDate >= 251117) {
		palObj.channelBitLSBIndex = [1, 5, 9];
		palObj.bigEndian = true;
	} else {
		//Temporary compatibility with b251111 and older
		palObj.channelBitLSBIndex = [9, 13, 1];
		palObj.bigEndian = false;
	}
	
	palObj.init();
}