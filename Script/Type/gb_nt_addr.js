//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_tilepos.js"

function init() {
	DefaultControls.init();
	initCommon();
	TPObj.init();
}

function initRender(a_bmv, a_param) {
	initCommon();
	TPObj.initRender(a_bmv, a_param);
}

function updateRender(a_bmv, a_param) {
	TPObj.updateRender(a_bmv, a_param);
}

function initCommon() {
	TPObj = new CommonTilepos();
	TPObj.width = 32;
	TPObj.height = 32;

	TPObj.tableSelectEnable = true;
	TPObj.tableSelectStrings.push("0: 9800");
	TPObj.tableSelectStrings.push("1: 9C00");
	TPObj.tableSelectStrings.push("-Outside range-");

	TPObj.getPosFunc = function(a_index, a_posobj) {
		var w = Core.getByte(0) | (Core.getByte(1) << 8);
		var pos_part = (w & 0x3FF);
		var y = pos_part >> 5;
		var x = pos_part & 0x1F;
		a_posobj.x = x;
		a_posobj.y = y;
	}

	TPObj.setPosFunc = function(a_index, a_y, a_x) {
		var w = Core.getByte(0) | (Core.getByte(1) << 8);
		var result = (w & 0xFC00);
		result |= ((a_y & 0x1F) << 5);
		result |= (a_x & 0x1F);
		Core.setByte(1, (result >> 8));
		Core.setByte(0, result & 0xFF);
	}

	TPObj.getAddrFunc = function() {
		return (Core.getByte(0) | (Core.getByte(1) << 8));
	}
	TPObj.setAddrFunc = function(a_addr) {
		Core.setByte(0, a_addr & 0xFF);
		Core.setByte(1, (a_addr >> 8) & 0xFF);
	}
	TPObj.getTableIndex = function() {
		var addr = this.getAddrFunc();
		if ((addr >= 0x9800) && (addr < 0xA000)) {
			var tableIndex = ((addr >> 10) & 1);
			return tableIndex;
		} else {
			return 2;
		}
	}
	TPObj.setTableIndex = function(a_index) {
		if (a_index >= 2) {return;}
		var addr = this.getAddrFunc();
		var newaddr = (addr & 0x3FF) + (a_index << 10) + 0x9800;
		this.setAddrFunc(newaddr);
	}
}