//FLEX_INCLUDE "common_grid.js"

CommonTile = function() {
	this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
	this.mode = 0;
	this.renderModeSubPalBase = 0;
	this.numOfColors = 4;
	this.setTileFunc = function(a_index) {}
	this.getPixFunc = function(y, x) {return 0;}
	this.setPixFunc = function(y, x, color) {}
	this.tileGrid = 0;
	this.tileBMview = 0;
	this.editGrid = 0;
	this.editBMview = 0;
	this.colorGrid = 0;
	this.colorBMview = 0;
	this.proportion = 3;
	this.pageSelectSpinCtrl = 0;
	this.tilePixelWidth = 8;
	this.tilePixelHeight = 8;
	this.pageSize = 256;
	this.previousEditPixelX = -1;
	this.previousEditPixelY = -1;
	this.base_pix_x = 0;
	this.base_pix_y = 0;
	this.base_index = 0;
	this.versionDate = 0;
}

CommonTile.prototype.init= function() {
	this.initCommon(0, 0, 0);
}

CommonTile.prototype.initRender = function(a_bmv, a_data) {
	this.initCommon(1, a_bmv, a_data);
}

CommonTile.prototype.initCommon = function(a_mode, a_bmv, a_data) {

   this.mode = a_mode;

	this.versionDate = Core.versionDate;
	if (Core.hasAttr("scale") == true) {
		this.proportion = Number(Core.getAttr("scale"));
	}

	var numOf = Core.getHexValueAttr("len");
	var numOfPages = 1;
	var gw = 16;
	var gh = 20;
	if (Core.hasAttr("rowlength") == true) {
		gw = Number(Core.getAttr("rowlength"));
	}
	if (numOf > this.pageSize) {
		gh = Math.ceil(this.pageSize/gw);
		numOfPages = Math.ceil(numOf / this.pageSize);
	} else {
		gh = Math.ceil(numOf/gw);
		if (gh == 1) {
			gw = numOf;
		}
	}
    	
	var cellw = this.tilePixelWidth*this.proportion;
	var cellh = this.tilePixelHeight*this.proportion;
	if (a_mode == 0) {
		this.tileBMview = new BitmapView(Core.window);
		this.tileBMview.move(Core.base_x, Core.base_y);
	} else {
		this.tileBMview = a_bmv;
	}
	this.tileGrid = new GridHandler(cellw, cellh, gw, gh, numOf, "tilegrid");
	this.tileGrid.redrawCellOnSelect = 0;
	this.tileGrid.parent = this;
	this.tileGrid.setBitmapView(this.tileBMview, false);
	var init = true;
	if (a_mode == 0) {
		this.tileBMview.mousePress.connect(this, this.tileBMviewClickFunc);
	} else {
		this.tileGrid.selectable = false;
		init = !(this.tileBMview.initialized);
		this.tileGrid.gridline_w = 0;
		this.tileGrid.gridline_h = 0;
		this.tileGrid.calculate(); // Recalculate
		//print(this.tileBMview.initialized);
	}
	var wpixels = this.tileGrid.getTotalWidth();
	var hpixels = this.tileGrid.getTotalHeight();
	if (init == true) {
		this.tileBMview.init(wpixels, hpixels);
	}
	this.tileGrid.drawItemFunc = this.drawSelectorFunc;

	if (Core.hasAttr("palette") == true) {
		var palstring = Core.getAttr("palette");
		var pal_arr = palstring.split(".");
		for (var ix = 0; ix < pal_arr.length; ix++) {
			this.palette[ix] = Number("0x" + pal_arr[ix]);
		}
	}
	
	if (this.versionDate >= 999999) {
		var ix_array = Core.childElementIndexes("palette");
		if (ix_array.length > 0) {

		}
	} else if (this.versionDate >= 260129) {
		var ix = Core.childElementIndex("palette");
		if (ix >= 0) {
			var fetchdata = Core.fetchElementData(ix);
			for (var ix = 0; ix < fetchdata.length; ix++) {
				this.palette[ix] = fetchdata[ix];
			}
		}
	}
	
	
	this.tileGrid.setIndex(0);
	
   if (a_mode == 0) {
	var local_base_y = Core.base_y;
	cellw = 18;
	cellh = 18;
	this.editBMview = new BitmapView(Core.window);
	this.editBMview.move(Core.base_x+this.tileBMview.width+15, local_base_y);
	this.editGrid = new GridHandler(cellw, cellh, this.tilePixelWidth, this.tilePixelHeight, (this.tilePixelWidth*this.tilePixelHeight), "editgrid");
	this.editGrid.redrawCellOnSelect = 0;
	this.editGrid.selectable = true;
	this.editGrid.currentcolor = this.editGrid.gridcolor;	//Temporary cheat
	this.editGrid.parent = this;
	this.editGrid.setBitmapView(this.editBMview, false);	//Todo: Set to false?
   	this.editBMview.mousePress.connect(this, this.editBMviewClickFunc);
	if (this.versionDate >= 260109) {
		this.editBMview.mouseMove.connect(this, this.editBMviewMoveFunc);
	}
	wpixels = this.editGrid.getTotalWidth();
	hpixels = this.editGrid.getTotalHeight();
	this.editBMview.init(wpixels, hpixels);
	this.editGrid.drawItemFunc = this.drawEditorFunc;


	local_base_y += this.editBMview.height + 15;

	var totalColors = this.palette.length;
	var cellw = 38;

	var cols;
	if (totalColors <= 4) {
		cols = totalColors;
	} else if (totalColors <= 32) {
		cols = 4;
	} else {
		cols = 16;
		cellw = 12;
	} 
	var cellh = Math.round(cellw * 1);
	var rows = Math.ceil(totalColors / cols);

	this.colorBMview = new BitmapView(Core.window);
	this.colorBMview.move(Core.base_x+this.tileBMview.width+15, local_base_y);
	this.colorGrid = new GridHandler(cellw, cellh, cols, rows, totalColors, "colorgrid");
	this.colorGrid.redrawCellOnSelect = 0;
	this.colorGrid.selectable = true;
	this.colorGrid.parent = this;
	this.colorGrid.setBitmapView(this.colorBMview, false);
	this.colorBMview.mousePress.connect(this, this.colorBMviewClickFunc);
	wpixels = this.colorGrid.getTotalWidth();
	hpixels = this.colorGrid.getTotalHeight();
	this.colorBMview.init(wpixels, hpixels);
	this.colorGrid.drawItemFunc = this.drawColorsFunc;

	local_base_y = Core.base_y + this.tileBMview.height + 10;
	if (numOfPages > 1) {
  
		var ctrl = new QLabel(Core.window);
		ctrl.text = "Page:";
		ctrl.styleSheet = "font: 15px";
		ctrl.move(Core.base_x+5, local_base_y+6);
		ctrl.show();

		ctrl = new QSpinBox(Core.window);
		this.pageSelectSpinCtrl = ctrl;
		ctrl.move(Core.base_x+50, local_base_y);
		ctrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 22px ";
		ctrl.resize(60, 32);
		ctrl.minimum = 0;
		ctrl.maximum = numOfPages-1;
		ctrl.programChanged = true;
		ctrl.value = 0;
		ctrl.programChanged = false;
		ctrl['valueChanged(int)'].connect(this, this.pageChangeFunc);
		ctrl.show();
	}

	this.colorGrid.redraw();
	this.colorBMview.refresh();
	this.colorBMview.show();

	this.setTileFunc(0);
	this.editGrid.redraw();
	this.editBMview.refresh();
	this.editBMview.show();
   

	var benchMark = false;
	if (benchMark == false) {
		this.tileGrid.redraw();
	} else {
		var rounds = 15;
		var avg = 0;
		for (var round = 0; round < rounds; round++) {

			var bench1 = Core.getMSTimer();
			this.tileGrid.redraw();
			var bench2 = Core.getMSTimer();
			avg += (bench2 / rounds);
		}
		print(avg);
	}
	
	this.tileBMview.refresh();
   }

	this.tileBMview.show();

}

CommonTile.prototype.updateRender = function(a_bmv, a_data) {

	
	this.tileGrid.setBitmapView(a_bmv, false);

	var v_data = [];
	if (Array.isArray(a_data) == true) {
		v_data = a_data;
	} else {
		v_data.push(a_data);
	}

	for (var ix = 0; ix < v_data.length; ix++) {
		if (v_data[ix].hasOwnProperty("palette") && v_data[ix].hasOwnProperty("paletteentries")) {
			for (var ixb = 0; ixb < v_data[ix].paletteentries; ixb++) {
				this.palette[ixb] = v_data[ix].palette[ixb];
			}
		}
		
		if (v_data[ix].hasOwnProperty("paletteindex")) {
			this.renderModeSubPalBase = v_data[ix].paletteindex;
		}
		
		if (v_data[ix].hasOwnProperty("x")) {this.base_pix_x = Number(v_data[ix].x);}
		if (v_data[ix].hasOwnProperty("y")) {this.base_pix_y = Number(v_data[ix].y);}
		if (v_data[ix].hasOwnProperty("index")) {this.base_index = v_data[ix].index;}

		//print(x);
		//print(y);
		//print(value);
		this.tileGrid.redraw();
	}
}

CommonTile.prototype.tileBMviewClickFunc = function(a_buttons, a_y, a_x) {
	this.tileGrid.eventMousePress(a_buttons, a_y, a_x);

	this.setTileFunc(this.tileGrid.getIndex());
	this.editGrid.redraw();
	this.editBMview.refresh();
}

CommonTile.prototype.editBMviewClickFunc = function(a_buttons, a_y, a_x) {
	this.editGrid.eventMousePress(a_buttons, a_y, a_x);

	var y = this.editGrid.current_y;
	var x = this.editGrid.current_x;
	this.previousEditPixelX = x;
	this.previousEditPixelY = y;
	var color = this.colorGrid.getIndex();
	this.setPixFunc(y, x, color);

	this.editGrid.redrawCurrentCell();
	this.editBMview.refresh();

	this.tileGrid.redrawCurrentCell();
	this.tileBMview.refresh();
}

CommonTile.prototype.editBMviewMoveFunc = function(a_buttons, a_y, a_x) {
	this.editGrid.eventMousePress(a_buttons, a_y, a_x);
	if ((this.previousEditPixelX != this.editGrid.current_x) || 
	(this.previousEditPixelY != this.editGrid.current_y)) {
		this.editBMviewClickFunc(a_buttons, a_y, a_x);
	}
}

CommonTile.prototype.colorBMviewClickFunc = function(a_buttons, a_y, a_x) {
      var prevSubPal = Math.floor(this.colorGrid.getIndex() / this.numOfColors);

    	this.colorGrid.eventMousePress(a_buttons, a_y, a_x);

      var subPal =  Math.floor(this.colorGrid.getIndex() / this.numOfColors);

      if (subPal != prevSubPal) {

		this.tileGrid.redraw();
		this.tileBMview.refresh();

		this.setTileFunc(this.tileGrid.getIndex());
		this.editGrid.redraw();
		this.editBMview.refresh();
      }
}

CommonTile.prototype.drawSelectorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var color;
    var y, x;
    var parent = this.parent;
    	a_x += parent.base_pix_x;
    	a_x2 += parent.base_pix_x;
    	a_y += parent.base_pix_y;
    	a_y2 += parent.base_pix_y;
	a_index += parent.base_index;
    var prop = parent.proportion;
    var subPalBase = 0;
    if (parent.mode == 0) {
        subPalBase = (Math.floor(parent.colorGrid.getIndex() / parent.numOfColors) * parent.numOfColors);
    } else {
        subPalBase = (Math.floor(parent.renderModeSubPalBase / parent.numOfColors) * parent.numOfColors);
    }
    //a_index contains the total index (page base included)
    parent.setTileFunc(a_index);
    if (prop == 1) {
	if (parent.versionDate >= 260131) {
		var buffer = new Array(parent.tilePixelWidth*parent.tilePixelHeight);
		var pointer = 0;
		for (var pixY = 0; pixY < parent.tilePixelHeight; pixY++) {
	   for (var pixX = 0; pixX < parent.tilePixelWidth; pixX++) {
			buffer[pointer++] = parent.palette[subPalBase + parent.getPixFunc(pixY, pixX)];
		}
      }
		this.drawBuffer(a_y, a_y+7, a_x, a_x+7, buffer);
	} else {
		for (var pixY = 0; pixY < parent.tilePixelHeight; pixY++) {
		for (var pixX = 0; pixX < parent.tilePixelWidth; pixX++) {
		color = subPalBase + parent.getPixFunc(pixY, pixX);
		var RGBcolor = parent.palette[color];
		this.setPixel(a_y + pixY, a_x + pixX, RGBcolor);
		}
		}
	}
    } else {
	if (parent.versionDate >= 260131) {
		var buffer = new Array((parent.tilePixelHeight*prop)*(parent.tilePixelWidth*prop));
		for (var pixY = 0; pixY < parent.tilePixelHeight; pixY++) {
		var base2 = ((pixY*prop)*(prop*parent.tilePixelWidth));
		for (var pixX = 0; pixX < parent.tilePixelWidth; pixX++) {
			var base = base2 + (pixX*prop);
			var RGBcolor = parent.palette[subPalBase+parent.getPixFunc(pixY, pixX)];
			for (var suby = 0; suby < prop; suby++) {
			for (var subx = 0; subx < prop; subx++) {
				buffer[base++] = RGBcolor;
			}
			base += (prop*(parent.tilePixelWidth-1));
			}
		}
		}
		this.drawBuffer(a_y, a_y+(parent.tilePixelHeight*prop)-1, a_x, a_x+(parent.tilePixelWidth*prop)-1, buffer);
	} else {
		for (var pixY = 0; pixY < parent.tilePixelHeight; pixY++) {
		for (var pixX = 0; pixX < parent.tilePixelWidth; pixX++) {
		y = a_y + (pixY * prop);
		x = a_x + (pixX * prop);
		color = subPalBase + parent.getPixFunc(pixY, pixX);
		this.drawBox(y, y+prop-1, x, x+prop-1,  parent.palette[color]);
		}
		}
	}
    }
}

CommonTile.prototype.drawEditorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
	var subPalBase = (Math.floor(this.parent.colorGrid.getIndex() / this.parent.numOfColors) * this.parent.numOfColors);
	var color = this.parent.getPixFunc(a_cell_y, a_cell_x) + subPalBase;
	this.drawBox(a_y, a_y2, a_x, a_x2, this.parent.palette[color]);
}

CommonTile.prototype.drawColorsFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
	var RGBcolor = this.parent.palette[a_index];
	this.drawBox(a_y, a_y2, a_x, a_x2, RGBcolor);
}

CommonTile.prototype.pageChangeFunc = function(a_value) {
	this.tileGrid.setPage(a_value);

	this.tileGrid.redraw();
	this.tileBMview.refresh();

	this.setTileFunc(this.tileGrid.getIndex());

	this.editGrid.redraw();
	this.editBMview.refresh();

}
