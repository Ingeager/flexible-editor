//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_tilepos.js"

//(Work in progress)

function init() {
	DefaultControls.init();

	TPObj = new CommonTilepos();
	TPObj.width = 32;
	TPObj.height = 32;
	TPObj.base = -1;

	if (Core.hasAttr("base")) {
		TPObj.base = Core.getHexValueAttr("base");
	}

	TPObj.getPosFunc = function(a_index, a_posobj) {
		var w = Core.getByte(0) | (Core.getByte(1) << 8);
		var pos_part;
		if (TPObj.base == -1) {
			pos_part = (w & 0x7FF);
		} else {
			pos_part = (w - TPObj.base) & 0x7FF;
		}
		var y = pos_part >> 6;
		var x = (pos_part & 0x3F) >> 1;
		a_posobj.x = x;
		a_posobj.y = y;
	}
	
	TPObj.setPosFunc = function(a_index, a_y, a_x) {
		var w = Core.getByte(0) | (Core.getByte(1) << 8);
		var word;
		if (TPObj.base == -1) {
			word = (w & 0xF800);
		} else {
			word = TPObj.base;
		}
		word += (a_y << 6);
		word += a_x << 1;
		Core.setByte(0, word & 0xFF);
		Core.setByte(1, (word >> 8) & 0xFF);
	}
	
	TPObj.init();
}