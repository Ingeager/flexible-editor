//FLEX_INCLUDE "common_chr.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 16

function init() {
	DefaultControls.init();
	tileHandler = new CommonTile();
	tileHandler.buffer = new Array(16);
	tileHandler.tilePixelWidth = 8;
	tileHandler.tilePixelHeight = 8;
	tileHandler.numOfColors = 4;
	tileHandler.tileIndex = 0;
	
	tileHandler.setTileFunc = function(a_index) {
		tileHandler.tileIndex = a_index;
		var ptr = (a_index*16);
		if (Core.versionDate >= 260206) {
			this.buffer = Core.getByteArray(ptr, 16);
		} else {
			for (var ix = 0; ix < 16; ix++) {
				this.buffer[ix] = Core.getByte(ptr + ix);
			}
		}
	}
	
	tileHandler.getPixFunc = function(a_y, a_x) {
		   var b = 7 - a_x;
		    return(
		    ((this.buffer[a_y] >> b) & 1) |
		    (((this.buffer[a_y + 8] >> b) & 1) << 1)
		);
	}
	
	tileHandler.setPixFunc = function(a_y, a_x, a_color) {
		var ptr = (this.tileIndex*16);
		var b = 7 - a_x;
		var mask = (~(1<<b));
		Core.setByte(ptr+a_y, this.buffer[a_y]=(this.buffer[a_y] & mask | ((a_color & 1)<<b)));
		Core.setByte(ptr+a_y+8, this.buffer[a_y+8]=(this.buffer[a_y+8] & mask | (((a_color & 2)>>1)<<b)));
	}
	tileHandler.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
	
    tileHandler.init();
}

function initFetch() {
	//Todo: Send back tile bitmap data
}

function initRender(a_bitmapView, a_y1, a_x1, a_y2, a_x2) {
	//Todo: Probably draw a single tile..?
}