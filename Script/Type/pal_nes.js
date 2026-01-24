//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_palette.js"

function init() {
	DefaultControls.init();

	palObj = new CommonPalette();
	palObj.indexed = true;
	palObj.indexedPalette = Core.NESPalette;
	palObj.indexedPaletteSize = 64;
	palObj.bitSize = 8;
	palObj.bigEndian = false;
	
	palObj.getIndexedRGB = function(index) {
		return(CommonPalette.prototype.getIndexedRGB.call(this, index & 0x3F));
	}
	
	palObj.init();
}

//Idea for future function that allows using palette data in other data types
function initFetch() {

	palObj = new CommonPalette();
	palObj.indexed = true;
	palObj.indexedPalette = Core.NESPalette;
	palObj.indexedPaletteSize = 64;
	palObj.bitSize = 8;
	palObj.bigEndian = false;
	
	palObj.getIndexedRGB = function(index) {
		return(CommonPalette.prototype.getIndexedRGB.call(this, index & 0x3F));
	}
	
	//palObj.initFetch();
}
