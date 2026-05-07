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

function initCommon() {
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
}