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
   this.addrEdit = 0;
   this.tblSelectCombo = 0;
	this.blockColor = 0x0090A0;
	this.darkColor = 0;
   this.tableSelectEnable = false;
   this.tableSelectStrings = [];

   this.byteSize = 2;
	this.getPosFunc = function(a_index, a_posobj) {
		a_posobj.x = 0;
		a_posobj.y = 0;
	}
	this.setPosFunc = function(a_index, a_y, a_x) {}
   this.getPosFunc2 = function() {
       var posobj = {};
       posobj.x = 0;
       posobj.y = 0;
       this.getPosFunc(0, posobj);
       return posobj;
   }
   this.setPosFunc2 = function(a_y, a_x) {this.setPosFunc(0, a_y, a_x); }
   this.getAddrFunc = function() {return 0;}
   this.setAddrFunc = function(a_addr) {};
   this.getTableIndex = function() {return 0;}
   this.setTableIndex = function(a_index) {};

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

	this.bitmap = a_bmv;

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

//To be implemented
CommonTilepos.prototype.initFetch = function() {
   // this.initCommon(this.modeFetch);

	var pos = this.getPosFunc2();

   var data_arr = [];
   data_arr.push(pos.y);
   data_arr.push(pos.x);
   return( data_arr );
}

CommonTilepos.prototype.initCommon = function(a_mode, a_bmv) {

   if (Core.hasAttr("len")  &&  (Core.versionDate >= 251111)) {
       Core.setArrayByteSize(this.byteSize);
       DefaultControls.addArrayTuner();
   }
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
	
	var pos = this.getPosFunc2();
	this.grid.current_x = pos.x;
	this.grid.current_y = pos.y;
	this.grid.drawItemFunc = this.drawItemFunc;


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
                    extraData = Core.getHexValueAttr("render.len", indexList[ix]);
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

   if (a_mode != this.modeNormal) {return;}

	this.bitmap.mousePress.connect(this, this.gridMousePressFunc);

   if (Core.versionDate >= 251111) {
       Event.signal.connect(this, this.eventFunc);
   } else {
	    event.signal.connect(this, this.eventFunc);
   }
	

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
    ctrl.styleSheet = Core.customize("edit.stylesheet", "");
    ctrl.programChanged = false;
    ctrl['valueChanged(int)'].connect(this, this.spinYChangeFunc);
    ctrl.show();
    suby += 30;

   ctrl = new QLabel(parentWnd);
   ctrl.text = "X:";
   ctrl.move(subx, suby);
   ctrl.resize(20, 20);
   ctrl.show();

    ctrl = new QSpinBox(parentWnd);
    this.spinX = ctrl;
    ctrl.move(subx+20, suby);
    ctrl.resize(45, 20);
    ctrl.minimum = 0;
    ctrl.maximum = this.width-1;
    ctrl.value = pos.x;
    ctrl.styleSheet = Core.customize("edit.stylesheet", "");
    ctrl.programChanged = false;
    ctrl['valueChanged(int)'].connect(this, this.spinXChangeFunc);
    ctrl.show();
    suby += 30;

   ctrl = new QLabel(parentWnd);
   ctrl.text = "Addr:";
   ctrl.move(subx, suby);
   ctrl.resize(30, 20);
   ctrl.show();

    ctrl = new QLineEdit(parentWnd);
    this.addrEdit = ctrl;
    ctrl.move(subx+30, suby);
    ctrl.resize(55, 20);
    ctrl.styleSheet = Core.customize("edit.stylesheet", "");
    ctrl.textEdited.connect(this, this.addrEditFunc);
    ctrl.show();
    suby += 30;

    ctrl.text = this.getAddrFunc().toString(16);

    if (this.tableSelectEnable) {
	   ctrl = new QLabel(parentWnd);
	   ctrl.text = "Table Select:";
	   ctrl.move(subx, suby);
	   ctrl.resize(150, 20);
	   ctrl.show();
	   suby += 22;
	   
        ctrl = new QComboBox(parentWnd);
	this.tblSelectCombo = ctrl;
        ctrl.move(subx, suby);
        ctrl.resize(150, 30);
        for (var ix = 0; ix < this.tableSelectStrings.length; ix++) {
             ctrl.addItem(this.tableSelectStrings[ix]);
        }
         ctrl.editable = false;
	   	 ctrl.styleSheet = Core.customize("edit.stylesheet", "") + "; font: 14px";
	 	  ctrl['activated(int)'].connect(this, this.tblListChangeFunc);
        ctrl.show();
        ctrl.setCurrentIndex(this.getTableIndex());
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
  
	ix = 0;
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
	ix = 0;
        while ((ix = this.imageTag.indexOf("fgimage", ix)) >= 0) {
            Core.updateRender(this.imageRHnd[ix], this.bitmap, param);
            ix++;
         }
	 ix = 0;
         while ((ix = this.imageTag.indexOf("fgcellimage", ix)) >= 0) {
           Core.updateRender(this.imageRHnd[ix], this.bitmap, this.render_param_fgcell[ix]);
          ix++;
       }
    }
    
}

CommonTilepos.prototype.spinXChangeFunc = function(a_value) {
	if (this.spinX.programChanged == true) {return;}

	var pos = this.getPosFunc2();
	pos.x = a_value;
	this.setPosFunc(0, pos.y, pos.x);
	this.grid.current_x = pos.x;

	this.redraw();
	this.bitmap.refresh();

   this.addrEdit.text =  this.getAddrFunc().toString(16);

}

CommonTilepos.prototype.spinYChangeFunc = function(a_value) {
	if (this.spinY.programChanged == true) {return;}
	
	var pos = this.getPosFunc2();
	pos.y = a_value;
	this.setPosFunc(0, pos.y, pos.x);
	this.grid.current_y = pos.y;

	this.redraw();
	this.bitmap.refresh();

   this.addrEdit.text =  this.getAddrFunc().toString(16);
}

CommonTilepos.prototype.addrEditFunc = function(a_text) {
    var v = parseInt(a_text, 16);
    if (v.isNaN) {return;}
    this.setAddrFunc(v);
    var pos = this.getPosFunc2();
    this.grid.current_y = pos.y;
    this.grid.current_x = pos.x;
    this.redraw();
    this.bitmap.refresh();

   this.tblSelectCombo.setCurrentIndex(this.getTableIndex());
}

CommonTilepos.prototype.tblListChangeFunc = function(a_index) {
    this.setTableIndex(a_index);
    this.addrEdit.text =  this.getAddrFunc().toString(16);
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

   this.addrEdit.text =  this.getAddrFunc().toString(16);
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
		var param_fg = {};
	       param_fg.x = x1;
	       param_fg.y = y1;
	       param_fg.x2 = x2;
	       param_fg.y2 = y2;
           param_fg.index = tpos.renderStats.fgcellCounter;
           var ix = 0;
           while ((ix = tpos.imageTag.indexOf("fgcellimage", ix)) >= 0) {
               if (tpos.renderStats.fgcellCounter < tpos.imageExtraData[ix]) {
                   tpos.render_param_fgcell[ix].push(param_fg);
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

CommonTilepos.prototype.eventFunc = function(a_flags) {
	/*if (flags && event.bit.changeindex) {
		//Update controls
	}*/
   
	var pos = this.getPosFunc2();
	this.grid.current_y = pos.y;
   this.grid.current_x = pos.x;
   this.spinY.value = pos.y;
   this.spinX.value = pos.x;

	this.redraw();
	this.bitmap.refresh();

   this.addrEdit.text =  this.getAddrFunc().toString(16);
}
