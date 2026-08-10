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
	this.imageTag = [];
	this.imageRHnd = [];
	this.imageExtraData = [];
	this.renderStats = {};
	this.renderStats.mode = 0;
	this.renderStats.fgcellCounter = -1;
	this.render_param_bgcell = [];
	this.render_param_fgcell = [];
	this.renderFGCellExist = false;
	this.current_pixel_x = 0;
	this.current_pixel_y = 0;

	this.modeNormal = 1;
	this.modeRender = 2;
	this.modeFetch = 3;
}

CommonTilepos.prototype.initRender = function(a_bmv, a_param) {
   this.initCommon(this.modeRender, a_bmv);
}

CommonTilepos.prototype.updateRender = function(a_bmv, a_param) {

	var param_arr = [];
	if (Array.isArray(a_param) == false) {
		param_arr.push(a_param);
	} else {
		param_arr = a_param;
	}
	
	for (var par_ix = 0; par_ix < param_arr.length; par_ix++) {

		var v_param = param_arr[par_ix];
		
		this.redraw();

	}
	
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
   
  if (Core.hasAttr("pixelw")) {
      this.cellwidth = Number(Core.getAttr("pixelw"));
  }
  if (Core.hasAttr("pixelh")) {
      this.cellheight = Number(Core.getAttr("pixelh"));
  }

	this.grid = new GridHandler(this.cellwidth, this.cellheight, this.width, this.height);
	this.grid.parent = this;
	this.grid.redrawCellOnSelect = -1;
	this.grid.setBitmapView(this.bitmap, false);
	var wpixels = this.grid.getTotalWidth();
	var hpixels = this.grid.getTotalHeight();

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

    //Initialize Render elements
    if (Core.versionDate >= 260629)  {
        var indexList = Core.childElementIndexList("");
        for (var ix = 0; ix < indexList.length; ix++) {
            var handle = false;
            var extraData = 0;
            var tagName = Core.getElementTag(indexList[ix]).toLowerCase();
            if (tagName == "bgimage") {handle = true;}
            if (tagName == "fgimage") {handle = true;}
            if (tagName == "bgcellimage") {handle = true;}
            if (tagName == "fgcellimage") {
                handle = true;
                extraData = 16;
                if (Core.hasAttr("render.len", indexList[ix])) {
                    extraData = Number(Core.getAttr("render.len", indexList[ix]));
                }
                this.renderFGCellExist = true;
            }
            if (handle == true) {
                var param = {};
                var hnd = Core.initRender(indexList[ix], this.bitmap, param);
                var arr_ix = this.imageTag.length;

                this.imageTag[arr_ix] = tagName;
                this.imageRHnd[arr_ix] = hnd;
                this.imageExtraData[arr_ix] = extraData;
                this.render_param_fgcell[arr_ix] = [];

            }
        }
    }

	this.bitmap.show();
	this.redraw();
	this.bitmap.refresh();

}

CommonTilepos.prototype.redraw = function() {
    var ix = 0;
     var param = {};
    var bmheight = this.grid.getTotalHeight();
    var bmwidth = this.grid.getTotalWidth();
    this.bitmap.drawBox(0, bmheight-1, 0, bmwidth-1, this.darkColor);

    if (this.imageTag.length > 0) {
  
       while ((ix = this.imageTag.indexOf("bgimage", ix)) >= 0) {
           Core.updateRender(this.imageRHnd[ix], this.bitmap, param);
           ix++;
       }
       for (ix = 0; ix < this.imageTag.length; ix++) {
           this.render_param_fgcell[ix] = [];
       }
       this.render_param_bgcell = [];
       this.renderStats.mode = 1;
       this.renderStats.fgcellCounter = -1;
        // "draw" all cells (gather parameter data)
	    for (var celly = 0; celly < this.grid.height; celly++) {
	    for (var cellx = 0; cellx < this.grid.width; cellx++) {
	    	this.grid.redrawCell(celly, cellx);
	    }
	    }

       ix = 0;
       while ((ix = this.imageTag.indexOf("bgcellimage", ix)) >= 0) {
           Core.updateRender(this.imageRHnd[ix], this.bitmap, this.render_param_bgcell);
           ix++;
       }
    }
    this.renderStats.mode = 0;

       // Draw cells in mode 0.
	    for (var celly = 0; celly < this.grid.height; celly++) {
	    for (var cellx = 0; cellx < this.grid.width; cellx++) {
	    	this.grid.redrawCell(celly, cellx);
	    }
	    }
    this.grid.redrawGrid();
    if (this.imageTag.length > 0) {
        param.x = this.current_pixel_x;
        param.y = this.current_pixel_y;
        while ((ix = this.imageTag.indexOf("fgimage", ix)) >= 0) {
            Core.updateRender(this.imageRHnd[ix], this.bitmap, param);
            ix++;
         }
         while ((ix = this.imageTag.indexOf("fgcellimage", ix)) >= 0) {
           Core.updateRender(this.imageRHnd[ix], this.bitmap, this.render_param_fgcell[ix]);
          ix++;
       }
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

	this.redraw();
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

	this.redraw();
	this.bitmap.refresh();
}

CommonTilepos.prototype.gridMousePressFunc = function(a_buttons, a_y, a_x) {
	this.grid.eventMousePress(a_buttons, a_y, a_x);
	
	var y = this.grid.current_y;
	var x = this.grid.current_x;
	this.setPosFunc(0, y, x);
	
	this.grid.lockflag = true;
	this.redraw();
	this.bitmap.refresh();
	this.grid.lockflag = false;
	
	this.spinX.programChanged = true;
	this.spinY.programChanged = true;
	this.spinX.value = x;
	this.spinY.value = y;
	this.spinX.programChanged = false;
	this.spinY.programChanged = false;

	//this.updateCurrentIndex();
}

CommonTilepos.prototype.drawItemFunc = function(a_index, a_page, cell_y, cell_x, y1, x1, y2, x2)  {


   var currentFlag = false;
	if ((cell_y == this.current_y) && (cell_x == this.current_x)) {
		currentFlag = true;
	}

   var tpos = this.parent;
   if (tpos.renderStats.mode == 1) {
       var param = {};
       param.index = a_index;
       param.x = x1;
       param.y = y1;
       param.x2 = x2;
       param.y2 = y2;
       tpos.render_param_bgcell.push(param);

       if (currentFlag) {
           tpos.renderStats.fgcellCounter = 0;
           tpos.current_pixel_x = x1;
           tpos.current_pixel_y = y1;
       }
       
       if (tpos.renderFGCellExist) {
       if (tpos.renderStats.fgcellCounter >= 0) {
           param.index = tpos.renderStats.fgcellCounter;
           var ix = 0;
           while ((ix = tpos.imageTag.indexOf("fgcellimage", ix)) >= 0) {
               if (tpos.renderStats.fgcellCounter < tpos.imageExtraData[ix]) {
                   tpos.render_param_fgcell[ix].push(param);
               }
               ix++;
          }
           tpos.renderStats.fgcellCounter++;
       }
       }

	} else if (currentFlag) {
		this.drawBox(y1, y2, x1, x2, tpos.blockColor);
	}
}

CommonTilepos.prototype.eventFunc = function(flags) {
	/*if (flags && event.bit.changeindex) {
		//Update controls
	}*/
}
