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

//Render Init (Future Idea)
function initRender(a_bitmapView, a_y1, a_x1, a_y2, a_x2) {
	initCommon();
	palObj.render(a_bitmapView, a_y1, a_x1, a_y2, a_x2);
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
