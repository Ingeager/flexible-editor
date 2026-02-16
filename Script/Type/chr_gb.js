//FLEX_INCLUDE "common_chr.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 16

//Note: needs updated COMMON_CHR.js

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
		    ((this.buffer[(a_y*2)] >> b) & 1) |
		    (((this.buffer[(a_y*2) + 1] >> b) & 1) << 1)
		);
	}
	
	tileHandler.setPixFunc = function(a_y, a_x, a_color) {
		var ptr = (this.tileIndex*16);
		var b = 7 - a_x;
		var c = a_y*2;
		var mask = (~(1<<b));
		Core.setByte(ptr+c, this.buffer[c]=(this.buffer[c] & mask | ((a_color & 1)<<b)));
		Core.setByte(ptr+c+1, this.buffer[c+1]=(this.buffer[c+1] & mask | (((a_color & 2)>>1)<<b)));
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