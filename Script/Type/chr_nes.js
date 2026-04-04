//FLEX_INCLUDE "common_chr.js"
//FLEX_INCLUDE "common_default.js"

//FLEX_INDEXSIZE 16

function init() {
	DefaultControls.init();
	initCommon(false);
	tileHandler.init();
}

function initRender(a_bitmapView, a_param) {
	initCommon(true);
	
	tileHandler.initRender(a_bitmapView, a_param);
}

function updateRender(a_bitmapView, a_param) {
	tileHandler.updateRender(a_bitmapView, a_param);
}

function initFetch() {
	//Todo: Send back tile bitmap data
}

function initCommon(a_useBufferBig) {
	tileHandler = new CommonTile();
	tileHandler.useBuffer = a_useBufferBig;
	if ((a_useBufferBig == true) && (Core.versionDate >= 260206)) {
		tileHandler.bufferSize = 256;
		tileHandler.buffer = Core.getByteArray(0, 16*tileHandler.bufferSize );
	} else {
		tileHandler.buffer = new Array(16);
	}
	
	tileHandler.tilePixelWidth = 8;
	tileHandler.tilePixelHeight = 8;
	tileHandler.numOfColors = 4;
	tileHandler.tileIndex = 0;
	
	tileHandler.setTileFunc = function(a_index) {
		tileHandler.tileIndex = a_index;
		if (a_useBufferBig == false) {
			var ptr = (a_index*16);
			if (Core.versionDate >= 260206) {
				this.buffer = Core.getByteArray(ptr, 16);
			} else {
				for (var ix = 0; ix < 16; ix++) {
					this.buffer[ix] = Core.getByte(ptr + ix);
				}
			}
		} else {
			if (a_index >= tileHandler.bufferSize) {
				var ptr = (a_index*16);
				var buffer = Core.getByteArray(ptr, 16);
				for (var ix = 0; ix < 16; ix++) {
					this.buffer[ptr+ix] = buffer[ix];
				}
			}
		}
	
	}
	
	if (a_useBufferBig == false) {
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
	} else {
		tileHandler.getPixFunc = function(a_y, a_x) {
			var ptr = (this.tileIndex*16) + a_y;
			   var b = 7 - a_x;
			    return(
			    ((this.buffer[ptr] >> b) & 1) |
			    (((this.buffer[ptr + 8] >> b) & 1) << 1)
			);
		}
		
		tileHandler.setPixFunc = function(a_y, a_x, a_color) {
			var ptr = (this.tileIndex*16)+a_y;
			var b = 7 - a_x;
			var mask = (~(1<<b));
			Core.setByte(ptr, this.buffer[ptr]=(this.buffer[ptr] & mask | ((a_color & 1)<<b)));
			Core.setByte(ptr+8, this.buffer[ptr+8]=(this.buffer[ptr+8] & mask | (((a_color & 2)>>1)<<b)));
		}
	}
	
	
	tileHandler.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
}
