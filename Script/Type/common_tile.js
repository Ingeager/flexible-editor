//FLEX_INCLUDE "common_grid.js"


CommonTile = function() {
    this.mode = "_";
    this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
    this.getPixFunc = function(y, x) {return 0;}
    this.setPixFunc = function(y, x, color) {}
    this.tileGrid = 0;
    this.tileBMview = 0;
    this.editGrid = 0;
    this.editBMview = 0;
    this.unitByteSz = 1;
    this.proportion = 3;
    this.buffer = [];
}

CommonTile.prototype.init = function() {

    var numOf = Core.getHexValueAttr("len");
    var gw = 16;
    var gh = 16;
    if (numOf < 256) {
        gh = Math.ceil(numOf/16);
    }
    var cellw = 8*this.proportion;
    var cellh = 8*this.proportion;
    this.tileBMview = new BitmapView(Core.window);
    this.tileBMview.move(Core.base_x, Core.base_y);
    this.tileGrid = new GridHandler(cellw, cellh, gw, gh, numOf);
    this.tileGrid.redrawCellOnSelect = 0;
    this.tileGrid.parent = this;
   this.tileGrid.setBitmapView(this.tileBMview, true);
   var wpixels = this.tileGrid.getTotalWidth();
   var hpixels = this.tileGrid.getTotalHeight();
   this.tileBMview.init(wpixels, hpixels);
    this.tileGrid.drawItemFunc = this.drawSelectorFunc;
 
    this.initMode();
	if (Core.hasAttr("palette") == true) {
		var palstring = Core.getAttr("palette");
		var pal_arr = palstring.split(".", 4);
		for (var ix = 0; ix < pal_arr.length; ix++) {
			this.palette[ix] = Number(pal_arr[ix]);
		}
	}
	
    this.tileGrid.setIndex(0);
   this.tileGrid.redraw();
    this.tileBMview.refresh();
    this.tileBMview.show();

	this.loadBuffer(0);
   cellw = 18;
    cellh = 18;
    this.editBMview = new BitmapView(Core.window);
    this.editBMview.move(Core.base_x+this.tileBMview.width+15, Core.base_y);
    this.editGrid = new GridHandler(cellw, cellh, 8, 8, 64);
    this.editGrid.redrawCellOnSelect = 0;
    this.editGrid.selectable = false;
    this.editGrid.parent = this;
   this.editGrid.setBitmapView(this.editBMview, true);
   wpixels = this.editGrid.getTotalWidth();
   hpixels = this.editGrid.getTotalHeight();
   this.editBMview.init(wpixels, hpixels);
    this.editGrid.drawItemFunc = this.drawEditorFunc;
    this.editGrid.redraw();
    this.editBMview.refresh();
    this.editBMview.show();


}

CommonTile.prototype.initMode = function() {

    this.unitByteSz = 1;
    if (this.mode.toUpperCase().trim() === "NES") {
        this.getPixFunc = CommonTile.prototype.getPixNES;
        this.unitByteSz = 16;
        this.palette = [0, 0xFFFFFF, 0xBBBBBB, 0x777777];
    }
    this.buffer = [this.unitByteSz];
}

CommonTile.prototype.drawSelectorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var color;
    var y, x;
    this.parent.loadBuffer(a_index*16);
    if (this.parent.proportion == 1) {
    for (var pixY = 0; pixY < 8; pixY++) {
    for (var pixX = 0; pixX < 8; pixX++) {
        y = a_y + pixY;
        x = a_x + pixX;
        color = this.parent.getPixFunc(pixY, pixX);
        var RGBcolor = this.parent.palette[color];
        this.setPixel(y, x, RGBcolor);
    }
    }
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

CommonTile.prototype.drawEditorFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y, a_x, a_y2, a_x2) {
    var doty = Math.floor(a_index / 8);
    var dotx = Math.floor(a_index & 7);
    var color = this.parent.getPixFunc(doty, dotx);
    var RGBcolor = this.parent.palette[color];
    this.drawBox(a_y, a_y2, a_x, a_x2, RGBcolor);
}

CommonTile.prototype.loadBuffer = function(a_ptr) {
    var ix;
    for (ix = 0; ix < this.unitByteSz; ix++) {
        this.buffer[ix] = Core.getByte(a_ptr + ix);
    }
}


CommonTile.prototype.getPixNES = function(a_y, a_x) {
   var b = 7 - a_x;
    return(
    ((this.buffer[a_y] >> b) & 1) |
    (((this.buffer[a_y + 8] >> b) & 1) << 1)
    );
}

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
