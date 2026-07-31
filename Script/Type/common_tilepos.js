//FLEX_INCLUDE "common_grid.js"

CommonTilepos = function() {
	this.width = 32;
	this.height = 30;
	this.cellwidth = 12;
	this.cellheight = 11;
	this.grid = 0;
	this.bitmap = 0;
	this.spinX = 0;
	this.spinY = 0;
	this.blockColor = 0x0090A0;
	this.darkColor = 0;
	this.getPosFunc = function(a_index, a_posobj) {
		a_posobj.x = 0;
		a_posobj.y = 0;
	}
	this.setPosFunc = function(a_index, a_y, a_x) {}
	this.renderHnd_bgimage = 0;
	this.renderHnd_fgimage = 0;
	this.render_bgimage_cellbased = false;
	this.render_fgimage_cellbased = false;

	this.modeNormal = 1;
	this.modeRender = 2;
	this.modeFetch = 3;
}

CommonTilepos.prototype.initRender = function(a_bmv, a_param) {
   this.initCommon(this.modeRender, a_bmv);
}

CommonTilepos.prototype.updateRender = function(a_bmv, a_param) {
	this.grid.redraw();
}

CommonTilepos.prototype.init = function () {
    this.initCommon(this.modeNormal);
}

CommonTilepos.prototype.initFetch = function() {
   // this.initCommon(this.modeFetch);

	var pos = {};
	pos.x = 0;
	pos.y = 0;
	this.getPosFunc(0, pos);

   var data_arr = [];
   data_arr.push(pos.y);
   data_arr.push(pos.x);
   return( data_arr );
}

CommonTilepos.prototype.initCommon = function(a_mode, a_bmv) {
   var parentWnd;
   if (a_mode == this.modeNormal) {
	    parentWnd = Core.window;
	    this.bitmap = new BitmapView(parentWnd);
	    this.bitmap.move(Core.base_x, Core.base_y);
   } else if (a_mode == this.modeRender) {
       this.bitmap = a_bmv;
   }

	this.grid = new GridHandler(this.cellwidth, this.cellheight, this.width, this.height);
	this.grid.parent = this;
	this.grid.redrawCellOnSelect = 1;
	this.grid.setBitmapView(this.bitmap, false);
	var wpixels = this.grid.cell_start_x[this.grid.width]+this.grid.gridline_w;
	var hpixels = this.grid.cell_start_y[this.grid.height]+this.grid.gridline_h;

   var init = false;
   if (a_mode == this.modeNormal) {init = true;}
   if (a_mode == this.modeRender) {
       if (this.bitmap.initialized == false) {init = true;}
   }
   if (init == true) {
	    this.bitmap.init(wpixels,hpixels);
   }
	
	var pos = {};
	pos.x = 0;
	pos.y = 0;
	this.getPosFunc(0, pos);
	this.grid.current_x = pos.x;
	this.grid.current_y = pos.y;
	this.grid.drawItemFunc = this.drawItemFunc;

   if (a_mode != this.modeNormal) {return;}

	this.bitmap.mousePress.connect(this, this.gridMousePressFunc);
	event.signal.connect(this, this.eventFunc);
	
	this.grid.redraw();
	this.bitmap.refresh();
	this.bitmap.show();

   var subx = Core.base_x+wpixels+16;
   var suby = Core.base_y+15;

   var ctrl = new QLabel(parentWnd);
   ctrl.text = "Y:";
   ctrl.move(subx, suby);
   ctrl.resize(20, 20);
   ctrl.show();

    ctrl = new QSpinBox(parentWnd);
    this.spinY = ctrl;
    ctrl.move(subx+20, suby);
    ctrl.resize(45, 20);
    ctrl.minimum = 0;
    ctrl.maximum = this.height-1;
    ctrl.value = pos.y;
    ctrl.programChanged = false;
    ctrl['valueChanged(int)'].connect(this, this.spinYChangeFunc);
    ctrl.show();

   ctrl = new QLabel(parentWnd);
   ctrl.text = "X:";
   ctrl.move(subx, suby+30);
   ctrl.resize(20, 20);
   ctrl.show();

    ctrl = new QSpinBox(parentWnd);
    this.spinX = ctrl;
    ctrl.move(subx+20, suby+30);
    ctrl.resize(45, 20);
    ctrl.minimum = 0;
    ctrl.maximum = this.width-1;
    ctrl.value = pos.x;
    ctrl.programChanged = false;
    ctrl['valueChanged(int)'].connect(this, this.spinXChangeFunc);
    ctrl.show();

    //Initialize BGIMAGE and FGIMAGE Render elements
    if (Core.versionDate >= 270717)  {
        var elmindex = Core.childElementIndexList("bgimage");
	//...
        elmindex = Core.childElementIndexList("fgimage");
	//....
    }

}

CommonTilepos.prototype.spinXChangeFunc = function(a_value) {
	if (this.spinX.programChanged == true) {return;}
	var pos = {};
	pos.x = 0;
	pos.y = 0;
	this.getPosFunc(0, pos);
	pos.x = a_value;
	this.setPosFunc(0, pos.y, pos.x);
	this.grid.current_x = pos.x;

	this.grid.redraw();
	this.bitmap.refresh();
}

CommonTilepos.prototype.spinYChangeFunc = function(a_value) {
	if (this.spinY.programChanged == true) {return;}
	var pos = {};
	pos.x = 0;
	pos.y = 0;
	this.getPosFunc(0, pos);
	pos.y = a_value;
	this.setPosFunc(0, pos.y, pos.x);
	this.grid.current_y = pos.y;

	this.grid.redraw();
	this.bitmap.refresh();
}

CommonTilepos.prototype.gridMousePressFunc = function(a_buttons, a_y, a_x) {
	this.grid.eventMousePress(a_buttons, a_y, a_x);
	var y = this.grid.current_y;
	var x = this.grid.current_x;
	this.setPosFunc(0, y, x);
	this.spinX.programChanged = true;
	this.spinY.programChanged = true;
	this.spinX.value = x;
	this.spinY.value = y;
	this.spinX.programChanged = false;
	this.spinY.programChanged = false;

	//this.updateCurrentIndex();
}

CommonTilepos.prototype.drawItemFunc = function(a_index, a_page, cell_y, cell_x, y1, x1, y2, x2)  {

	if ((cell_y == this.current_y) && (cell_x == this.current_x)) {
		this.drawBox(y1, y2, x1, x2, this.parent.blockColor);
	} else {
		this.drawBox(y1, y2, x1, x2, this.parent.darkColor);
	}

}

CommonTilepos.prototype.eventFunc = function(flags) {
	/*if (flags && event.bit.changeindex) {
		//Update controls
	}*/
}
