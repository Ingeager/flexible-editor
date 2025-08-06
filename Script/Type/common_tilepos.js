//FLEX_INCLUDE "common_grid.js"

CommonTilepos = function() {
	this.width = 32;
	this.height = 30;
	this.grid = {};
	this.bitmap = {};
	this.getPosFunc = function(a_index, a_posobj) {
		a_posobj.x = 0;
		a_posobj.y = 0;
	}
	this.setPosFunc = function(a_index, a_y, a_x) {}
}

CommonTilepos.prototype.init = function () {

	var parentWnd = Core.window;
	this.bitmap = new BitmapView(parentWnd);
	this.bitmap.move(Core.base_x, Core.base_y);

	this.grid = new GridHandler(12, 11, this.width, this.height);
	this.grid.parent = this;
	this.grid.redrawCellOnSelect = 1;
	this.grid.setBitmapView(this.bitmap, false);
	var wpixels = this.grid.cell_start_x[this.grid.width]+this.grid.gridline_w;
	var hpixels = this.grid.cell_start_y[this.grid.height]+this.grid.gridline_h;
	this.bitmap.init(wpixels,hpixels);
	
	pos = {};
	pos.x = 0;
	pos.y = 0;
	this.getPosFunc(0, pos);
	this.grid.current_x = pos.x;
	this.grid.current_y = pos.y;
	this.grid.drawItemFunc = this.drawItemFunc;

	this.bitmap.mousePress.connect(this, this.gridMousePressFunc);
	event.signal.connect(this, this.eventFunc);
	
	this.grid.redraw();
	this.bitmap.refresh();
	this.bitmap.show();
}


CommonTilepos.prototype.gridMousePressFunc = function(a_buttons, a_y, a_x) {
	this.grid.eventMousePress(a_buttons, a_y, a_x);
	var y = this.grid.current_y;
	var x = this.grid.current_x;
	this.setPosFunc(0, y, x);
	//this.updateCurrentIndex();
}

CommonTilepos.prototype.drawItemFunc = function(a_index, a_page, cell_y, cell_x, y1, x1, y2, x2)  {

	if ((cell_y == this.current_y) && (cell_x == this.current_x)) {
		this.drawBox(y1, y2, x1, x2, 0x0090A0);
	} else {
		this.drawBox(y1, y2, x1, x2, 0);
	}

}

CommonTilepos.prototype.eventFunc = function(flags) {
	if (flags && event.bit.changeindex) {
		//Update controls
	}
}
