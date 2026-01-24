//FLEX_INCLUDE "common_tile.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 16

function init() {
	DefaultControls.init();
    tileHandler = new CommonTile();
    tileHandler.mode = "NES";
    tileHandler.init();
}