//FLEX_INCLUDE "common_grid.js"

CommonTile = function() {
    this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
    this.numOfColors = 4;
    this.getPixFunc = function(y, x) {return 0;}
    this.changeReadTileFunc = function(a_index) {}
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
    this.tileGrid = new GridHandler(cellw, cellh, gw, gh, numOf);
    this.tileGrid.redrawCellOnSelect = 0;
    this.tileGrid.parent = this;
   this.tileGrid.setBitmapView(this.tileBMview, false);
   	this.tileBMview.mousePress.connect(this, this.tileBMviewClickFunc);
   var wpixels = this.tileGrid.getTotalWidth();
   var hpixels = this.tileGrid.getTotalHeight();
   this.tileBMview.init(wpixels, hpixels);
    this.tileGrid.drawItemFunc = this.drawSelectorFunc;

   // this.buffer = [this.unitByteSz];
	if (Core.hasAttr("palette") == true) {
		var palstring = Core.getAttr("palette");
		var pal_arr = palstring.split(".");
		for (var ix = 0; ix < pal_arr.length; ix++) {
			this.palette[ix] = Number("0x" + pal_arr[ix]);
		}
	}
	
	if (Core.versionDate >= 260129) {
		var ix = Core.childElementIndex("palette");
		if (ix >= 0) {
			var fetchdata = Core.fetchElementData(ix);
			for (var ix = 0; ix < fetchdata.length; ix++) {
				this.palette[ix] = fetchdata[ix];
			}
		}
	}
	
	
	this.tileGrid.setIndex(0);
	this.tileGrid.redraw();
	this.tileBMview.refresh();
	this.tileBMview.show();

	//this.loadBuffer(0);
	this.changeReadTileFunc(0);
	cellw = 18;
	cellh = 18;
	this.editBMview = new BitmapView(Core.window);
	this.editBMview.move(Core.base_x+this.tileBMview.width+15, Core.base_y);
	this.editGrid = new GridHandler(cellw, cellh, this.tilePixelWidth, this.tilePixelHeight, (this.tilePixelWidth*this.tilePixelHeight));
	this.editGrid.redrawCellOnSelect = 0;
	this.editGrid.selectable = true;
	this.editGrid.currentcolor = this.editGrid.gridcolor;	//Temporary cheat
	this.editGrid.parent = this;
	this.editGrid.setBitmapView(this.editBMview, true);
   	this.editBMview.mousePress.connect(this, this.editBMviewClickFunc);
	if (Core.versionDate >= 260109) {
		this.editBMview.mouseMove.connect(this, this.editBMviewMoveFunc);
	}
	wpixels = this.editGrid.getTotalWidth();
	hpixels = this.editGrid.getTotalHeight();
	this.editBMview.init(wpixels, hpixels);
	this.editGrid.drawItemFunc = this.drawEditorFunc;
	this.editGrid.redraw();
	this.editBMview.refresh();
	this.editBMview.show();

	cellw = 38;
	cellh = 24;
	var rows = 1;
	var cols = 4;
	rows = Math.ceil(this.numOfColors / 4);
	if (rows == 1) {
		cols = this.numOfColors;
	}
	this.colorBMview = new BitmapView(Core.window);
	this.colorBMview.move(Core.base_x+this.tileBMview.width+15, Core.base_y+this.editBMview.height + 15);
	this.colorGrid = new GridHandler(cellw, cellh, rows, cols, this.numOfColors);
	this.colorGrid.redrawCellOnSelect = 0;
	this.colorGrid.selectable = true;
	this.colorGrid.parent = this;
	this.colorGrid.setBitmapView(this.colorBMview, true);
	wpixels = this.colorGrid.getTotalWidth();
	hpixels = this.colorGrid.getTotalHeight();
	this.colorBMview.init(wpixels, hpixels);
	this.colorGrid.drawItemFunc = this.drawColorsFunc;
	this.colorGrid.redraw();
	this.colorBMview.refresh();
	this.colorBMview.show();
}

/*CommonTile.prototype.initMode = function() {

    this.unitByteSz = 1;
    if (this.mode.toUpperCase().trim() === "NES") {
        this.getPixFunc = CommonTile.prototype.getPixNES;
        this.unitByteSz = 16;
        this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
    }
    this.buffer = [this.unitByteSz];
}*/

CommonTile.prototype.tileBMviewClickFunc = function(a_buttons, a_y, a_x) {
	this.tileGrid.eventMousePress(a_buttons, a_y, a_x);

	this.changeReadTileFunc(this.tileGrid.getIndex());
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


CommonTile.prototype.drawSelectorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var color;
    var y, x;
    this.parent.changeReadTileFunc(a_index);
    if (this.parent.proportion == 1) {
	if (Core.versionDate >= 260131) {
		var buffer = new Array(64);
		var pointer = 0;
		for (var pixY = 0; pixY < 8; pixY++) {
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 0)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 1)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 2)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 3)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 4)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 5)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 6)];
			buffer[pointer++] =  this.parent.palette[this.parent.getPixFunc(pixY, 7)];
		}
		this.bmvObject.drawBuffer(a_y, a_y+7, a_x, a_x+7, buffer);
	} else {
		for (var pixY = 0; pixY < 8; pixY++) {
		for (var pixX = 0; pixX < 8; pixX++) {
		color = this.parent.getPixFunc(pixY, pixX);
		var RGBcolor = this.parent.palette[color];
		this.setPixel(a_y + pixY, a_x + pixX, RGBcolor);
		}
		}
	}
    } else {
	if (Core.versionDate >= 260131) {
		var prop = this.parent.proportion;
		var buffer = new Array((8*prop)*(8*prop));
		for (var pixY = 0; pixY < 8; pixY++) {
		for (var pixX = 0; pixX < 8; pixX++) {
			var RGBcolor = this.parent.palette[this.parent.getPixFunc(pixY, pixX)];
			for (var suby = 0; suby < prop; suby++) {
			var base = (((pixY*prop)+suby)*(prop*8))+(pixX*prop);
			for (var subx = 0; subx < prop; subx++) {
				buffer[base+subx] = RGBcolor;
			}
			}
		}
		}
		this.bmvObject.drawBuffer(a_y, a_y+(8*this.parent.proportion)-1, a_x, a_x+(8*this.parent.proportion)-1, buffer);
	} else {
		for (var pixY = 0; pixY < 8; pixY++) {
		for (var pixX = 0; pixX < 8; pixX++) {
		y = a_y + (pixY * this.parent.proportion);
		x = a_x + (pixX * this.parent.proportion);
		color = this.parent.getPixFunc(pixY, pixX);
		var RGBcolor = this.parent.palette[color];
		this.drawBox(y, y+this.parent.proportion-1, x, x+this.parent.proportion-1, RGBcolor);
		}
		}
	}
    }
}

CommonTile.prototype.drawEditorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var doty = Math.floor(a_index / 8);
    var dotx = Math.floor(a_index & 7);
    var color = this.parent.getPixFunc(doty, dotx);
    var RGBcolor = this.parent.palette[color];
    this.drawBox(a_y, a_y2, a_x, a_x2, RGBcolor);
}

CommonTile.prototype.drawColorsFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
	var RGBcolor = this.parent.palette[a_index];
	this.drawBox(a_y, a_y2, a_x, a_x2, RGBcolor);
}

/*CommonTile.prototype.loadBuffer = function(a_ptr) {
    var ix;
    for (ix = 0; ix < this.unitByteSz; ix++) {
        this.buffer[ix] = Core.getByte(a_ptr + ix);
    }
}*/

/*
CommonTile.prototype.getPixNES = function(a_y, a_x) {
   var b = 7 - a_x;
    return(
    ((this.buffer[a_y] >> b) & 1) |
    (((this.buffer[a_y + 8] >> b) & 1) << 1)
    );
}*/

/*
transcode = function(chn_depth, plane_depth, y_depth, x_depth, a_chn_count, a_plane_count, a_y_count, a_x_count) {
 var doloop = true;
 var mode = 0;
 var depth = 0;
 var channel = 0;

 while (doloop) {

 if (depth == deepest) {
   var x = position[x_depth];
   var y = position[y_depth];
   var channel = position[chn_depth];
   var plane = position[plane_depth];
   var biv = (byv >> bitp) & 1;
   result[channel].p[plane].y[y].x[x] |= (biv << plane);
   mode = 3;
 }

 switch (mode) {
 case 0: //init
   if (move[depth] > 0) {
     position[depth] = 0;
   } else {
     position[depth] = last[depth];
   }
   mode = 2;
   break;
 case 1: //crawl
   position[depth] += move[depth];

   if ((move[depth] < 0) && (point[depth] < 0)) {
     mode = 3;
   } elseif ((move[depth] > 0) && (point[depth] >= last[depth])) {
     mode = 3;
   } else {
     mode = 2;
   }
   break;
 case 2: //descend
   depth++;
   mode = 0;
   break;
 case 3: //ascend
   depth--;
   mode = 1;
   if (depth < 0) {
     doloop = false;
   }
   break;
 }
 
 }

}
*/
