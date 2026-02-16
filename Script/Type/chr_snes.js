//FLEX_INCLUDE "common_chr.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 32

function init() {
	DefaultControls.init();
	tileHandler = new CommonTile();
	//tileHandler.bufferBig = Core.getByteArray(0, 32*256);
	tileHandler.buffer = new Array(32);
	tileHandler.tilePixelWidth = 8;
	tileHandler.tilePixelHeight = 8;
	tileHandler.numOfColors = 16;
	tileHandler.tileIndex = 0;
	
	tileHandler.setTileFunc = function(a_index) {
		this.tileIndex = a_index;
		var ptr = (a_index*32);
		if (Core.versionDate >= 260206) {
			this.buffer = Core.getByteArray(ptr, 32);
		} else {
			for (var ix = 0; ix < 32; ix++) {
				this.buffer[ix] = Core.getByte(ptr + ix);
			}
		}
		/*for (var ix = 0; ix < 32; ix++) {
			this.buffer[ix] = this.bufferBig[ptr+ix];
		}*/
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
	
	/*tileHandler.setWriteTileFunc = function(a_index) {
		this.writeTileIndex = a_index;
		this.setReadTileFunc(a_index);
	}*/
	tileHandler.setPixFunc = function(a_y, a_x, a_color) {
	
		var ptr = (this.tileIndex*32);
		var b = 7 - a_x;
		var c = a_y*2;
		var mask = (~(1<<b));
		Core.setByte(ptr+c, this.buffer[c]=(this.buffer[c] & mask | ((a_color & 1)<<b)));
		Core.setByte(ptr+c+1, this.buffer[c+1]=(this.buffer[c+1] & mask | (((a_color & 2)>>1)<<b)));
		Core.setByte(ptr+c+16, this.buffer[c+16]=(this.buffer[c+16] & mask | (((a_color & 4)>>2)<<b)));
		Core.setByte(ptr+c+17, this.buffer[c+17]=(this.buffer[c+17] & mask | (((a_color & 8)>>3)<<b)));
	}
	
	tileHandler.palette = [0x1F170F, 0x3F2F1F, 0x5F472F, 0x7F5F3F, 0x9F774F, 0xBF8F5F, 0xDFA76F, 0xFFBF7F,
					0x0F171F, 0x1F2F3F, 0x2F475F, 0x3F5F7F, 0x4F779F, 0x5F8FBF, 0x6FA7DF, 0x7FBFFF];
	
	tileHandler.init();

}