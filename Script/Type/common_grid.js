//GridHandler. Can be used with BitmapView object.

//Call "setBitmapView(object, handleMouse)" to draw to a BitmapView object.
//You can also override the drawing methods of GridHandler yourself:
//	setPixel(Y, X, 24BitColor)
//	drawLineX(Y, X, X2, 24BitColor)
//	drawLineY(Y, Y2, X, 24BitColor)
//These functions do nothing if there's nothing to draw to.

//You can override method drawItemFunc(cell_index, cell_page, cell_y, cell_x, y1, x1, y2, x2)
//to draw the contents of cells. x1 and x2 is the first and last x coordinates in the bitmap to draw. y1 and y2 are the first and last y.
//You can call the functions listed above from here.
//It's possible to handle drawing yourself. This function does nothing by default.

//You can set up method drawDisabledFunc(cell_index, cell_page, cell_y, cell_x, y1, x2, y2, x2)
//to draw the contents of a disabled or out-of-boundary cell. By default, it tries to fill the box with the parent window's background color.

function GridHandler(argcellw, argcellh, argw, argh, arg_entries) {
	if (argcellw == undefined) {
		this.cell_size_w = 24;
	} else {
		this.cell_size_w = argcellw;
	}
	if (argcellh == undefined) {
		this.cell_size_h = 24;
	} else {
		this.cell_size_h = argcellh;
	}
	if (argw == undefined) {
		this.width = 8;
	} else {
		this.width = argw;
	}
	if (argh == undefined) {
		this.height = 8;
	} else {
		this.height = argh;
	}
	if (arg_entries == undefined) {
		this.entries = (this.height * this.width);
	} else {
		this.entries = arg_entries;
	}

	this.bgcolor = 0;
	this.currentcolor = 0xCFCFCF;
	this.gridcolor = 0x2F2F2F;
	this.bmvObject = 0;
	this.selectable = true;
	this.multiPage = false;
	this.current_y = 0;
	this.current_x = 0;
	this.current_page = 0;
	this.gridline_w = 2;
	this.gridline_h = 2;
	this.redrawCellOnSelect = 0;	//0 = None (Grid Only), 1 = Old cell and new cell, 2 = Redraw all cells on select (slow)
	//this.redrawGridOnSelect = 1; (To be implemented) //0 = Do nothing. 1 = Draw relevant parts. 2 = Redraw whole grid.
	
	this.setPixel = function(y, x, color) {}
	this.drawLineX = function(y, x, x2, color) {}
	this.drawLineY = function(y, y2, x, color) {}
	this.drawBox = function(y, y2, x, x2, color) {}
	
	this.drawItemFunc = function(cell_index, cell_page, cell_y, cell_x, y1, x1, y2, x2) {}
	this.drawDisabledFunc = function(cell_index, cell_page, cell_y, cell_x, y1, x2, y2, x2) {
		this.drawBox(y1, y2, x1, x2, Core.winpal.bgcolor);
	}
	
	this.cell_start_y = [];
	this.cell_start_x = [];
	this.cell_size_w_arr = [];
	this.cell_size_h_arr = [];
	
	this.cell_enabled = new Array(this.entries);
	for (var ec = 0; ec < this.entries; ec++) {
		this.cell_enabled[ec] = true;
	}

	/*this.cell_start_y = new Array(this.height+1);
	this.cell_start_x = new Array(this.width+1);
	this.cell_size_w_arr = new Array(this.width+1);
	this.cell_size_h_arr = new Array(this.height+1);*/

	this.calculate();

}

GridHandler.prototype.getIndex = function() {
	var cell_index = (this.current_page*(this.width*this.height)) + (this.current_y * this.width) + this.current_x;
	return cell_index;
}

GridHandler.prototype.setCurrentIndex = function(a_index) {
	if (a_index >= this.entries) {return;}
	this.current_page = Math.floor(a_index / (this.width*this.height));
	this.current_y = Math.floor((a_index - (this.current_page * (this.width*this.height))) / this.width);
	this.current_x = a_index % this.width;
}

GridHandler.prototype.setPage = function(a_page) {
	this.current_page = a_page;
	var index = this.getIndex();
	if (index >= this.entries) {
		this.current_x = 0;
		this.current_y = 0;
	}
}

GridHandler.prototype.eventMousePress = function(a_buttons, a_y, a_x) {
	var celly_click = 0;
	var cellx_click = 0;
	for (celly = 0; celly < this.height; celly++) {
		if (a_y >= this.cell_start_y[celly]) {
			celly_click = celly;
		}
	}
	for (cellx = 0; cellx < this.width; cellx++) {
		if (a_x >= this.cell_start_x[cellx]) {
			cellx_click = cellx;
		}
	}
	
	var cell_index = this.calculateIndex(celly_click, cellx_click);
	
	if (cell_index < this.entries) {
		if (this.cell_enabled[cell_index] == true) {

			var old_current_y = this.current_y;
			var old_current_x = this.current_x;
			this.current_y = celly_click;
			this.current_x = cellx_click;
	
			if (this.redrawCellOnSelect == 2) {
				this.redraw();
			} else if (this.redrawCellOnSelect == 1) {
				this.redrawCell(old_current_y, old_current_x);
				this.redrawCell(this.current_y, this.current_x);
				this.redrawGrid();
			} else {
				this.redrawGrid();
			}

			this.bmvObject.refresh();

			//event.dispatch(event.bit.changeindex);

		}
	}
	
}

//a_handleMouse == true will make GridHandler handle mouse interaction and handle drawing accordingly.

GridHandler.prototype.setBitmapView = function(a_bmvObject, a_handleMouse) {
	this.bmvObject = a_bmvObject;
	this.setPixel = function(y, x, color) {this.bmvObject.setPixel(y, x, color);}
	this.drawLineX = function(y, x, x2, color) {this.bmvObject.drawLineX(y, x, x2, color);}
	this.drawLineY = function(y, y2, x, color) {this.bmvObject.drawLineY(y, y2, x, color);}
	this.drawBox = function(y1, y2, x1, x2, color) {this.bmvObject.drawBox(y1, y2, x1, x2, color);}
	
	if (a_handleMouse == true) {
		this.bmvObject.mousePress.connect(this, this.eventMousePress);
	}
	
	//this.bmvObject.resize(this.cell_start_x[this.width]+this.gridline_w, this.cell_start_y[this.height]+this.gridline_h);
}

GridHandler.prototype.redrawCurrentCell = function() {
	this.redrawCell(this.current_y, this.current_x);
}

GridHandler.prototype.checkActiveCell = function(a_index) {
	var activecell = true;
	if (this.cell_enabled[a_index] == false) {
		activecell = false;
	} else if (a_index >= this.entries) {
		activecell = false;
	}
	return activecell;
}

GridHandler.prototype.redrawCell = function(a_celly, a_cellx) {
	var entry = this.calculateIndex(a_celly, a_cellx);
	var activecell = true;
	if (this.cell_enabled[entry] == false) {
		activecell = false;
	} else if (entry >= this.entries) {
		activecell = false;
	}
	if (activecell == false) {
		x1 = this.cell_start_x[a_cellx];
		x2 = this.cell_start_x[a_cellx+1]-1+this.gridline_w;
		y1 = this.cell_start_y[a_celly];
		y2 = this.cell_start_y[a_celly+1]-1+this.gridline_h;
		this.drawDisabledFunc(this.calculateIndex(a_celly, a_cellx, this.current_page), this.current_page, a_celly, a_cellx, y1, x1, y2, x2);
	} else {
		x1 = this.cell_start_x[a_cellx] + this.gridline_w;
		x2 = this.cell_start_x[a_cellx+1]-1;
		y1 = this.cell_start_y[a_celly] + this.gridline_h;
		y2 = this.cell_start_y[a_celly+1]-1;
		this.drawItemFunc(this.calculateIndex(a_celly, a_cellx, this.current_page), this.current_page, a_celly, a_cellx, y1, x1, y2, x2);
	}
}

GridHandler.prototype.calculateIndex = function(a_celly, a_cellx, a_page) {
	var page = (a_page == undefined) ? this.current_page : a_page;
	return ((page * (this.height*this.width)) + (a_celly*this.width) + a_cellx);
}

GridHandler.prototype.getTotalHeight = function() {
	return (this.cell_start_y[this.height] + this.gridline_h);
}

GridHandler.prototype.getTotalWidth = function() {
	return (this.cell_start_x[this.width] + this.gridline_w);
}

GridHandler.prototype.redrawGrid = function() {
	/*var lastFullRow = 0;
	if ((this.multiPage == false) || ((this.multiPage == true) && (this.current_page == (this.getPagesCount()-1)))) {
		
	}*/
	
	var singleGridLineW = (this.gridline_w == 1);
	var singleGridLineH = (this.gridline_h == 1);
	for (celly = 0; celly < this.height; celly++) {
	for (cellx = 0; cellx < this.width; cellx++) {
		thisentry = this.calculateIndex(celly, cellx);
		if (this.checkActiveCell(thisentry) == true) {
			x = this.cell_start_x[cellx];
			x2 = this.cell_start_x[cellx+1];
			if (singleGridLineW == true) {
				this.drawLineY(this.cell_start_y[celly]+this.gridline_h, this.cell_start_y[celly+1]-1, x, this.gridcolor);
				this.drawLineY(this.cell_start_y[celly]+this.gridline_h, this.cell_start_y[celly+1]-1, x2, this.gridcolor);
			} else {
				this.drawBox(this.cell_start_y[celly]+this.gridline_h, this.cell_start_y[celly+1]-1, x, x+this.gridline_w-1, this.gridcolor);
				this.drawBox(this.cell_start_y[celly]+this.gridline_h, this.cell_start_y[celly+1]-1, x2, x2+this.gridline_w-1, this.gridcolor);
			}
			y = this.cell_start_y[celly];
			y2 = this.cell_start_y[celly+1];
			if (singleGridLineH == true) {
				this.drawLineX(y+suby, this.cell_start_x[cellx], this.cell_start_x[cellx+1]+this.gridline_w-1, this.gridcolor);
				this.drawLineX(y2+suby, this.cell_start_x[cellx], this.cell_start_x[cellx+1]+this.gridline_w-1, this.gridcolor);
			} else {
				this.drawBox(y, y+this.gridline_h-1, this.cell_start_x[cellx], this.cell_start_x[cellx+1]+this.gridline_w-1, this.gridcolor);
				this.drawBox(y2, y2+this.gridline_h-1, this.cell_start_x[cellx], this.cell_start_x[cellx+1]+this.gridline_w-1, this.gridcolor);
			}
		}
	}
	}

	//var total_y = this.cell_start_y[this.height] + this.gridline_h;
	//var total_x = this.cell_start_x[this.width] + this.gridline_w;

	x = this.cell_start_x[this.current_x];
	x2 = this.cell_start_x[this.current_x+1];
	for (subx = 0; subx < this.gridline_w; subx++) {
		this.drawLineY(this.cell_start_y[this.current_y], this.cell_start_y[this.current_y+1]+this.gridline_h-1, x+subx, this.currentcolor);
		this.drawLineY(this.cell_start_y[this.current_y], this.cell_start_y[this.current_y+1]+this.gridline_h-1, x2+subx, this.currentcolor);
	}
	y = this.cell_start_y[this.current_y];
	y2 = this.cell_start_y[this.current_y+1];
	for (suby = 0; suby < this.gridline_h; suby++) {
		this.drawLineX(y+suby, this.cell_start_x[this.current_x], this.cell_start_x[this.current_x+1]+this.gridline_w-1, this.currentcolor);
		this.drawLineX(y2+suby, this.cell_start_x[this.current_x], this.cell_start_x[this.current_x+1]+this.gridline_w-1, this.currentcolor);
	}
}

GridHandler.prototype.redraw = function() {

	for (var celly = 0; celly < this.height; celly++) {
	for (var cellx = 0; cellx < this.width; cellx++) {
		this.redrawCell(celly, cellx);
	}
	}
	
	this.redrawGrid();

}

GridHandler.prototype.calculate = function() {
	for (cellx = 0; cellx < this.width; cellx++) {
	  this.cell_size_w_arr[cellx] = this.cell_size_w;
	}
	for (celly = 0; celly < this.height; celly++) {
	  this.cell_size_h_arr[celly] = this.cell_size_h;
	}

	var x = 0;
	for (cellx = 0; cellx < this.width+1; cellx++) {
	  this.cell_start_x[cellx] = x;
	  x += (this.gridline_w + this.cell_size_w_arr[cellx]);
	}
	var y = 0;
	for (celly = 0; celly < this.height+1; celly++) {
	  this.cell_start_y[celly] = y;
	  y += this.gridline_h + this.cell_size_h_arr[celly];
	}
}
