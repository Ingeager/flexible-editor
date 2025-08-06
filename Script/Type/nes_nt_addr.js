//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_tilepos.js"

function init() {
	DefaultControls.init();

	TPObj = new CommonTilepos();
	TPObj.width = 32;
	TPObj.height = 30;

	TPObj.getPosFunc = function(a_index, a_posobj) {
		var w = Core.getByte(1) | (Core.getByte(0) << 8);
		var pos_part = (w & 0x3FF);
		var y = pos_part >> 5;
		var x = pos_part & 0x1F;
		a_posobj.x = x;
		a_posobj.y = y;
	}

	TPObj.setPosFunc = function(a_index, a_y, a_x) {
		var w = Core.getByte(1) | (Core.getByte(0) << 8);
		var result = (w & 0xFC00);
		result |= ((a_y & 0x1F) << 5);
		result |= (a_x & 0x1F);
		Core.setByte(0, (result >> 8));
		Core.setByte(1, result & 0xFF);
	}
	
	TPObj.init();
}