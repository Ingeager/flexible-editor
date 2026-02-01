//FLEX_INCLUDE "common_chr.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 32

function init() {
	DefaultControls.init();
	tileHandler = new CommonTile();
	tileHandler.buffer = [32];
	tileHandler.tilePixelWidth = 8;
	tileHandler.tilePixelHeight = 8;
	tileHandler.numOfColors = 16;
	tileHandler.changeReadTileFunc = function(a_index) {
		var ptr = (a_index*32);
		for (var ix = 0; ix < 32; ix++) {
			this.buffer[ix] = Core.getByte(ptr + ix);
		}
	}
	tileHandler.getPixFunc = function(a_y, a_x) {
		   var b = 7 - a_x;
		    return(
		    ((this.buffer[(a_y*2)] >> b) & 1) |
		    (((this.buffer[(a_y*2) + 1] >> b) & 1) << 1) |
		    (((this.buffer[(a_y*2) + 16] >> b) & 1) << 2) |
		    (((this.buffer[(a_y*2) + 17] >> b) & 1) << 3)
		);
	}
	
	tileHandler.setPixFunc = function(a_y, a_x, a_color) {
		var b = 7 - a_x;
		var mask = (~(1<<b));
		this.buffer[(a_y*2)] = this.buffer[(a_y*2)] & mask | ((a_color & 1)<<b);
		this.buffer[(a_y*2)+1] = this.buffer[(a_y*2)+1] & mask | (((a_color & 2)>>1)<<b);
		this.buffer[(a_y*2)+16] = this.buffer[(a_y*2)+16] & mask | (((a_color & 4)>>2)<<b);
		this.buffer[(a_y*2)+17] = this.buffer[(a_y*2)+17] & mask | (((a_color & 8)>>3)<<b);
		var tileIndex = this.tileGrid.getIndex();
		var ptr = (tileIndex*32);
		for (var ix = 0; ix < 32; ix++) {
			Core.setByte(ptr + ix, this.buffer[ix]);
		}
	}
	
	tileHandler.palette = [0, 0xFFFFFF, 0xEEEEEE, 0xDDDDDD, 0xCCCCCC, 0xBBBBBB, 0xAAAAAA, 0x999999,
	0x888888, 0x777777, 0x666666, 0x555555, 0x444444, 0x333333, 0x222222, 0x111111];
	
    tileHandler.init();
}