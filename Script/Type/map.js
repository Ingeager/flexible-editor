//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_grid.js"

TileMap = {}

TileMap.renderArr = [];
TileMap.renderHndArr = [];
TileMap.mapBMview = 0;
TileMap.mapGrid = 0;
TileMap.selBMview = 0;
TileMap.selGrid = 0;
TileMap.pixelw = 8;
TileMap.pixelh = 8;
TileMap.width = 16;
TileMap.height = 16;
TileMap.entries = 256;
TileMap.parentParam = {};
TileMap.paramSetup = [];
TileMap.multiParam = true;
TileMap.paramDispatchList = [];
TileMap.simpleMode = false;

TileMap.width_spacing = {};
TileMap.width_spacing.v = 16;
TileMap.width_spacing.has = false;
TileMap.parentindex_mul = 1;
TileMap.index_bitsize = 8;
TileMap.index_mul = 1;
TileMap.index_ror = {};
TileMap.index_ror.has = false;
TileMap.index_ror.v = 0;

TileMap.dataCacheEnable = false;
TileMap.dataCache = [];

TileMap.font = [];

function init() {
	DefaultControls.init();
	initCommon(1, 0);
	// TileMap.refresh();
}

function initRender(a_bmv, a_data) {
	initCommon(2, a_bmv);
}

function initCommon(a_mode, a_bmv) {

	var numOf = Core.getHexValueAttr("len");
	var numOfPages = 1;
	var gw = 16;
	var gh = 20;
	if (Core.hasAttr("width") == true) {
		gw = Number(Core.getAttr("width"));
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
	
	TileMap.height = gh;
	TileMap.width = gw;
	TileMap.entries = numOf;
	
	// Store various settings
	if (Core.hasAttr("width_spacing") == true) {
		TileMap.width_spacing.has = true;
		TileMap.width_spacing.v = Number(Core.getAttr("width_spacing"));
	} else {
		TileMap.width_spacing.has = false;
	}

	if (Core.hasAttr("parentindex_mul")) {
	TileMap.parentindex_mul = Number(Core.getAttr("parentindex_mul"));
	}
	if (Core.hasAttr("index_bitsize")) {
	TileMap.index_bitsize = Number(Core.getAttr("index_bitsize"));
	}
	if (Core.hasAttr("index_mul")) {
	TileMap.index_mul = Number(Core.getAttr("index_mul"));
	}
	if (Core.hasAttr("index_ror") == true) {
	TileMap.index_ror.has = true;
	TileMap.index_ror.v = Number(Core.getAttr("index_ror"));
	} else  {
	TileMap.index_ror.has = false;
	}
	

    // Set up BitmapView for map
   var initbmv = false;

    if (a_mode == 1) {
        var ctrl = new BitmapView(Core.window);
        TileMap.mapBMview = ctrl;
        TileMap.mapBMview.move(Core.base_x, Core.base_y);
        initbmv = true;
    }
    if (a_mode == 2) {
        initbmv = !a_bmv.initialized;
        TileMap.mapBMview = a_bmv;
    }
    var grid = a_mode == 1 ? true : false;
    TileMap.pixelw = (Core.hasAttr("pixelw") == true) ? Number(Core.getAttr("pixelw")) : 8;
    TileMap.pixelh = (Core.hasAttr("pixelh") == true) ? Number(Core.getAttr("pixelh")) : 8;

    TileMap.mapGrid = new GridHandler(TileMap.pixelw, TileMap.pixelh, TileMap.width, TileMap.height, TileMap.numOf, "mapgrid");
    if (grid == false) {
        TileMap.mapGrid.gridline_w = 0;
	TileMap.mapGrid.gridline_h = 0;
	TileMap.mapGrid.calculate();
    }
    //TileMap.mapGrid.parent = TileMap;
    TileMap.mapGrid.setBitmapView(TileMap.mapBMview, false);

    if (initbmv == true) {
	var wpixels = TileMap.mapGrid.getTotalWidth();
	var hpixels = TileMap.mapGrid.getTotalHeight();
	//wpixels = 600;
	//hpixels = 600;

	TileMap.mapBMview.init(wpixels,hpixels);
    }

	TileMap.mapGrid.drawItemFunc = TileMap.mapGridDrawFunc;
    

    if (a_mode == 1) {
	Core.base_x += TileMap.mapBMview.width + 10;
    
	//Initialize grid for value selection
	var ctrl = new BitmapView(Core.window);
	TileMap.selBMview = ctrl;
	TileMap.selBMview.move(Core.base_x, Core.base_y);

	TileMap.selGrid = new GridHandler(TileMap.pixelw, TileMap.pixelh, 16, 16, 256, "selgrid");
	//TileMap.selGrid.parent = TileMap;
	TileMap.selGrid.setBitmapView(TileMap.selBMview, false);
	var wpixels = TileMap.selGrid.getTotalWidth();
	var hpixels = TileMap.selGrid.getTotalHeight();
	TileMap.selBMview.init(wpixels, hpixels);

	TileMap.selGrid.drawItemFunc = TileMap.selGridDrawFunc;

    }

    if (Core.versionDate < 280301) {
        TileMap.simpleMode = true;
    } else {

    // Initialize subitem child elements
//    var list = Core.childElementIndexList("subitem");

	var list = Core.childElementIndex("subitem");
	if (list >= 0) {
		TileMap.paramDispatchList[TileMap.renderArr.length] = [];
		TileMap.renderArr.push(list);
	}
	

   // Initialize child elements for rendering graphics
	if (TileMap.renderArr.length > 0) {
		for (var ix = 0; ix < TileMap.renderArr.length; ix++) {
			var elmIndex = TileMap.renderArr[ix];
			var param = {};
			var hnd = Core.initRender(elmIndex, TileMap.mapBMview, param);
			TileMap.renderHndArr[ix] = hnd;
		}
	} else {
      // If none are found, set to simple mode
      TileMap.simpleMode = true;
   }

	// Register param child element/data and keep in cache
	var param_ei = Core.childElementIndex("parameter");
	if (param_ei >= 0) {
		var data = Core.fetchElementData(param_ei);
		var dest_param = "index";
		var index_src = "index";
		var val_mul = 1;

		if (Core.hasAttr("map.dest", param_ei)) {
		dest_param = Core.getAttr("map.dest", param_ei);
		}
		if (Core.hasAttr("map.index_src", param_ei)) {
		index_src = Core.getAttr("map.index_src", param_ei);
		}
		if (Core.hasAttr("map.val_mul", param_ei)) {
		val_mul = Number(Core.getAttr("map.val_mul", param_ei));
		}

		var paramset = {};
		paramset.dest_param = dest_param;
		paramset.data = data;
		paramset.index_src = index_src;
		paramset.val_mul = val_mul;
		TileMap.paramSetup.push(paramset);

	}
   } // versionDate check

    if (TileMap.simpleMode == true) {
       TileMap.font[0] = [
"OOO", "__O", "OOO", "OOO", "O_O", "OOO", "_OO", "OOO",
"O_O",  "__O", "__O",  "__O",  "O_O", "O__",  "O__",  "__O", 
"O_O", "__O",  "OOO", "OOO", "OOO","OOO","OOO","__O",
"O_O", "__O", "O__",  "__O",   "__O",  "__O", "O_O", "_O_",
"OOO","__O", "OOO", "OOO", "__O",  "OOO","OOO", "_O_"];
        TileMap.font[1] = [
"OOO","OOO","_O_",  "OO_","_OO","OO_","OOO","OOO",
"O_O", "O_O",  "O_O",  "O_O","O__", "O_O","O__", "O__",
"OOO","OOO","OOO", "OO_", "O__","O_O","OOO","OOO",
"O_O", "__O", "O_O",  "O_O", "O__", "O_O","O__","O__",
"OOO","OO_",  "O_O", "OO_", "_OO", "OO_","OOO","O__"];

    }
  
    if (a_mode == 1) {
	var index = TileMap.getValue();
	TileMap.selGrid.setIndex(index);
	TileMap.mapBMview.mousePress.connect(TileMap.mapClickFunc);
	TileMap.selBMview.mousePress.connect(TileMap.selClickFunc);

	// Refresh everything if we're in normal data type mode.
	// If map.js is loaded in Render mode, map will be redrawn in updateRender.
	TileMap.redrawMapGrid();

	TileMap.mapBMview.refresh();
	TileMap.mapBMview.show();

	TileMap.selGrid.redraw();
   if (TileMap.simpleMode == false) {
	if (TileMap.multiParam == true) {
		for (var r_index = 0; r_index < TileMap.renderArr.length; r_index++) {
			Core.updateRender(TileMap.renderHndArr[r_index], TileMap.selBMview, TileMap.paramDispatchList[r_index]);
			TileMap.paramDispatchList[r_index].length = 0;
		}
	}
   }
	TileMap.selBMview.refresh();
	TileMap.selBMview.show();
    }

}

function updateRender(a_bmv, a_param) {

	TileMap.mapBMview = a_bmv;
	if (Array.isArray(a_param) == false) {
		TileMap.parentParam = a_param;
		TileMap.redrawMapGrid();
	} else {
		for (var ix = 0; ix < a_param.length; ix++) {
			TileMap.parentParam = a_param[ix];
			TileMap.redrawMapGrid();
		}
	}
}

TileMap.redrawMapGrid = function() {
//    TileMap.dataCache = Core.getByteArray(0, TileMap.entries);
//    TileMap.dataCacheEnable = true;
    TileMap.mapGrid.redraw();
//    TileMap.dataCacheEnable = false;
   if (TileMap.simpleMode == false) {
	if (TileMap.multiParam == true) {
		for (var r_index = 0; r_index < TileMap.renderArr.length; r_index++) {
			/*for (var ix = 0; ix < TileMap.paramDispatchList[r_index].length; ix++) {
				Core.updateRender(TileMap.renderHndArr[r_index], TileMap.mapBMview, TileMap.paramDispatchList[r_index][ix]);
			}*/
			Core.updateRender(TileMap.renderHndArr[r_index], TileMap.mapBMview, TileMap.paramDispatchList[r_index]);
			TileMap.paramDispatchList[r_index].length = 0;
		}
		
	}
   }
}

TileMap.mapClickFunc = function(a_buttons, a_y, a_x) {
	TileMap.mapGrid.eventMousePress(a_buttons, a_y, a_x);
	var index;
	
	if (TileMap.width_spacing.has == false) {
		index = TileMap.mapGrid.getIndex();
	} else {
		index = (TileMap.mapGrid.current_y * TileMap.width_spacing.v) + TileMap.mapGrid.current_x;
	}
	
	var value = TileMap.getValue(index);
	TileMap.selGrid.setIndex(value);
	TileMap.selGrid.redrawGrid();
	TileMap.selBMview.refresh();
}

TileMap.selClickFunc = function(a_buttons, a_y, a_x) {
	TileMap.selGrid.eventMousePress(a_buttons, a_y, a_x);
	var value = TileMap.selGrid.getIndex();
	var index;

	if (TileMap.width_spacing.has == false) {
		index = TileMap.mapGrid.getIndex();
	} else {
		index = (TileMap.mapGrid.current_y * TileMap.width_spacing.v) + TileMap.mapGrid.current_x;
	}

	TileMap.setValue(index, value);
	TileMap.mapGrid.redrawCurrentCell();
	if ((TileMap.simpleMode == false) &&  (TileMap.multiParam == true)) {
		for (var r_index = 0; r_index < TileMap.renderArr.length; r_index++) {
			Core.updateRender(TileMap.renderHndArr[r_index], TileMap.mapBMview, TileMap.paramDispatchList[r_index]);
			TileMap.paramDispatchList[r_index].length = 0;
		}
	}
	TileMap.mapBMview.refresh();
}

TileMap.getValue = function(a_index) {
   if (TileMap.dataCacheEnable == false) {
       return( Core.getByte(a_index) );
   } else {
       return( TileMap.dataCache[a_index] );
   }
}

TileMap.setValue = function(a_index, a_val) {
    Core.setByte(a_index, a_val);
}

TileMap.mapGridDrawFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {

	if (TileMap.width_spacing.has == true) {
		a_index = (a_cell_y * TileMap.width_spacing.v) + a_cell_x;
	}

   // if "index" is set, use as a relative pointer that can be modified through
   // various attributes.
   // "index" is usually a value read from the file in the parent element.
	var byteindex = 0;
	if (TileMap.parentParam.hasOwnProperty("index")) {
		byteindex = TileMap.parentParam.index;
	}
	
	//Simple operation: Multiply index passed from parent element.
	byteindex = byteindex*TileMap.parentindex_mul;

	//Operations done on a_index:
	var bitsize = TileMap.index_bitsize;
	if (TileMap.index_ror.has == true) {
		//Simple operation: Rotate right
		var ror = TileMap.index_ror.v;
		var back = a_index & ((1<<ror)-1);
		a_index = (a_index >> ror) | (back<<(bitsize-ror));
	}

	//Simple operation: Mul
	a_index = a_index*TileMap.index_mul;

	var cell_value = TileMap.getValue(a_index+byteindex);
	
	TileMap.renderCellCommon(TileMap.mapBMview, cell_value, a_index+byteindex, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2);
}

TileMap.selGridDrawFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {
	TileMap.renderCellCommon(TileMap.selBMview, a_index, a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2);
}

TileMap.renderCellCommon = function(a_bmv, a_index, a_parentindex, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {
  
	var obj = TileMap.parentParam;
	var param = {};
	if ((obj != null) && (typeof obj == "object")) {
		param = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) param[attr] = obj[attr];
		}
	}

        param.parentindex = a_parentindex;
        param.index = a_index;
        param.indexpage = a_page;

	if (param.hasOwnProperty("x")) {
		param.x = Number(param.x) + a_x1;
	} else {
		param.x = a_x1;
	}

	if (param.hasOwnProperty("y")) {
		param.y += a_y1;
	} else {
		param.y = a_y1;
	}
        param.x2 = param.x + a_x2;
        param.y2 = param.y + a_y2;
        param.cellx = a_cell_x;
        param.celly = a_cell_y;


	if (TileMap.paramSetup.length > 0) {
		for (var count = 0; count < TileMap.paramSetup.length; count++) {

			var setup = TileMap.paramSetup[count];
			var dest_param  = setup.dest_param;
			var index_src =  setup.index_src;

			if (param.hasOwnProperty(index_src)) {
				var index = param[index_src];
				var value =  setup.data[index];

				param[dest_param] = value * setup.val_mul;
			}
		}
	}
	
	if (TileMap.simpleMode == false) {
	if (TileMap.renderArr.length > 0) {

		for (var r_index = 0; r_index < TileMap.renderArr.length; r_index++) {

			if (TileMap.multiParam == false) {
				Core.updateRender(TileMap.renderHndArr[r_index], a_bmv, param);
			} else {
				TileMap.paramDispatchList[r_index].push(param);
			}

		}

	}
    
    } else {
        // Draw a colored box displaying the value
        var v = param.index;
        var color = ((v&1) << 23) | ((v&2)<<14) | ((v&4)<<5) |
                         ((v&8) << 19) | ((v&16)<<10) | ((v&32)<<1) |
                         ((v&64) << 15) | ((v&128) << 6);
        var ypixels = TileMap.pixelh;
        var xpixels = TileMap.pixelw;
        var buffer = new Array(ypixels*xpixels);
        for (var filli = 0; filli < (ypixels*xpixels); filli++) {
            buffer[filli] = color;
        }
        var digit = [];
        digit[0] = param.index >> 4;
        digit[1] = param.index & 0xF;
        for (var d = 0; d < 2; d++) {
           var fblock = digit[d] >> 3;
           var f_offset = (digit[d] & 7);
	
	var propx = xpixels/8;
	var digitxpixels = Math.floor(propx*3);
           for (var y = 0; y < ypixels; y++) {
               var fonty = Math.floor((y / ypixels) * 6);
               if (fonty < 5) {
                   var f_entry = f_offset+(fonty*8);
                   var fdata = TileMap.font[fblock][f_entry];

                   var basex = Math.floor(propx+(Math.floor(propx*4)*d));
                   for (var x = 0; x < digitxpixels; x++) {
                       var fontx = Math.floor((x / digitxpixels)*3);
                        if (fontx < 3) {
                           var px = fdata.charAt(fontx);
                           if (px == 'O') {
                              buffer[(y*xpixels)+x+basex] = (buffer[(y*xpixels)+x+basex] ^ 0xFFFFFF);
                           }
                        }
                   }
               }
           }
        }
        a_bmv.drawBuffer(a_y1, a_y2, a_x1, a_x2, buffer);
    }

}