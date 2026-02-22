//FLEX_INCLUDE "common_grid.js"

CommonTile = function() {
	this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
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
	this.tilePixelWidth = 8;
	this.tilePixelHeight = 8;
	this.previousEditPixelX = -1;
	this.previousEditPixelY = -1;
}

CommonTile.prototype.init = function() {

	if (Core.hasAttr("scale") == true) {
		this.proportion = Number(Core.getAttr("scale"));
	}

	var numOf = Core.getHexValueAttr("len");
	var gw = 16;
	var gh = 20;
	if (Core.hasAttr("rowlength") == true) {
		gw = Number(Core.getAttr("rowlength"));
	}
	gh = Math.ceil(numOf/gw);
	/*if (gh > 20) {
	gh = 20
	};*/
    	
	var cellw = this.tilePixelWidth*this.proportion;
	var cellh = this.tilePixelHeight*this.proportion;
	this.tileBMview = new BitmapView(Core.window);
	this.tileBMview.move(Core.base_x, Core.base_y);
	this.tileGrid = new GridHandler(cellw, cellh, gw, gh, numOf, "tilegrid");
	this.tileGrid.redrawCellOnSelect = 0;
	this.tileGrid.parent = this;
	this.tileGrid.setBitmapView(this.tileBMview, false);
	this.tileBMview.mousePress.connect(this, this.tileBMviewClickFunc);
	var wpixels = this.tileGrid.getTotalWidth();
	var hpixels = this.tileGrid.getTotalHeight();
	this.tileBMview.init(wpixels, hpixels);
	this.tileGrid.drawItemFunc = this.drawSelectorFunc;

	if (Core.hasAttr("palette") == true) {
		var palstring = Core.getAttr("palette");
		var pal_arr = palstring.split(".");
		for (var ix = 0; ix < pal_arr.length; ix++) {
			this.palette[ix] = Number("0x" + pal_arr[ix]);
		}
	}
	
	if (Core.versionDate >= 999999) {
		var ix_array = Core.childElementIndexes("palette");
		if (ix_array.length > 0) {

		}
	} else if (Core.versionDate >= 260129) {
		var ix = Core.childElementIndex("palette");
		if (ix >= 0) {
			var fetchdata = Core.fetchElementData(ix);
			for (var ix = 0; ix < fetchdata.length; ix++) {
				this.palette[ix] = fetchdata[ix];
			}
		}
	}
	
	
	this.tileGrid.setIndex(0);
	  
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
	this.editGrid.setBitmapView(this.editBMview, true);	//Todo: Set to false?
   	this.editBMview.mousePress.connect(this, this.editBMviewClickFunc);
	if (Core.versionDate >= 260109) {
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

	this.colorGrid.redraw();
	this.colorBMview.refresh();
	this.colorBMview.show();

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
	this.tileBMview.show();

	this.setTileFunc(0);
	this.editGrid.redraw();
	this.editBMview.refresh();
	this.editBMview.show();

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
		this.setTileFunc(this.tileGrid.getIndex());
		this.editGrid.redraw();
		this.editBMview.refresh();

		this.tileGrid.redraw();
		this.tileBMview.refresh();
      }
}

CommonTile.prototype.drawSelectorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var color;
    var y, x;
    var parent = this.parent;
    var prop = parent.proportion;
    var subPalBase = (Math.floor(parent.colorGrid.getIndex() / parent.numOfColors) * parent.numOfColors);
    parent.setTileFunc(a_index);
    if (prop == 1) {
	if (Core.versionDate >= 260131) {
		var buffer = new Array(parent.tilePixelWidth*parent.tilePixelHeight);
		var pointer = 0;
		for (var pixY = 0; pixY < parent.tilePixelHeight; pixY++) {
	   for (var pixX = 0; pixX < parent.tilePixelWidth; pixX++) {
			buffer[pointer++] =  parent.palette[subPalBase + parent.getPixFunc(pixY, pixX)];
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
	if (Core.versionDate >= 260131) {
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
