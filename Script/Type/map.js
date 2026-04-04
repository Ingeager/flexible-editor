//FLEX_INCLUDE "common_default.js"
//FLEX_INCLUDE "common_grid.js"

Map = {}

Map.renderArr = [];
Map.renderHndArr = [];
Map.mapBMview = 0;
Map.mapGrid = 0;
Map.selBMview = 0;
Map.selGrid = 0;
Map.pixelw = 8;
Map.pixelh = 8;
Map.width = 16;
Map.height = 16;
Map.entries = 256;
Map.current_x = 0;
Map.current_y = 0;
Map.parentParam = {};
Map.paramSetup = [];
Map.multiParam = true;
Map.paramDispatchList = [];
Map.simpleMode = false;

Map.totalwidth = {};
Map.totalwidth.v = 16;
Map.totalwidth.has = false;
Map.totalheight = {};
Map.totalheight.v = 16;
Map.totalheight.has = false;
Map.parentindex_mul = 1;
Map.index_bitsize = 8;
Map.index_mul = 1;
Map.index_ror = {};
Map.index_ror.has = false;
Map.index_ror.v = 0;
Map.versionDate = 0;

Map.dataCacheEnable = true;
Map.dataCache = [];
Map.dataCacheSz = 0;
Map.cacheExpandSize = 256;

// Enums
Map.modeNormal = 1;
Map.modeRender = 2;

Map.font = [];

function init() {
	DefaultControls.init();
	initCommon(Map.modeNormal, 0);
}

function initRender(a_bmv, a_data) {
	initCommon(Map.modeRender, a_bmv);
}

function initCommon(a_mode, a_bmv) {

	Map.versionDate = Core.versionDate;

  Map.pixelw = (Core.hasAttr("pixelw") == true) ? Number(Core.getAttr("pixelw")) : 8;
  Map.pixelh = (Core.hasAttr("pixelh") == true) ? Number(Core.getAttr("pixelh")) : 8;

	var gw = Math.ceil(256/Map.pixelw);
	var gh = Math.ceil(256/Map.pixelh);
   var numOf = gw*gh;
   var haslen = false;
   var haswidth = false;
   var hasheight = false;

   // Calculate grid setup
	if (Core.hasAttr("width") == true) {
		gw = Number(Core.getAttr("width"));
      haswidth = true;
	}
  if (Core.hasAttr("height") == true) {
		gh = Number(Core.getAttr("height"));
      hasheight = true;
	}
   if (Core.hasAttr("len") == true) {
      numOf = Core.getHexValueAttr("len");
      haslen = true;
   }
	
   if ((haswidth == true) && (hasheight == true) && (haslen == false)) {
       // H and W set, but not LEN
       numOf = gh * gw;
   }
   if ((haswidth == true) && (hasheight == false) && (haslen == true)) {
      // LEN and W set, but not H.
      gh = Math.ceil(numOf / gw);
  }
   if ((haslen == true) && (hasheight == false) && (haswidth == false)) {
      // Only LEN set.
       if (numOf < gw) {
          gh = 1;
          gw = numOf;
       } else {
          gh = Math.ceil(numOf / gw);
       }
   }
	
	Map.height = gh;
	Map.width = gw;
	Map.entries = numOf;
	
	// Store various settings
	if (Core.hasAttr("totalwidth") == true) {
		Map.totalwidth.has = true;
		Map.totalwidth.v = Number(Core.getAttr("totalwidth"));
	} else {
		Map.totalwidth.has = false;
	}
if (Core.hasAttr("totalheight") == true) {
		Map.totalheight.has = true;
		Map.totalheight.v = Number(Core.getAttr("totalheight"));
	} else {
		Map.totalheight.has = false;
	}


	if (Core.hasAttr("parentindex_mul")) {
	Map.parentindex_mul = Number(Core.getAttr("parentindex_mul"));
	}
	if (Core.hasAttr("index_mul")) {
	Map.index_mul = Number(Core.getAttr("index_mul"));
	}
   if (Core.hasAttr("index_bitsize")) {
	Map.index_bitsize = Number(Core.getAttr("index_bitsize"));
	}
	if (Core.hasAttr("index_ror") == true) {
	Map.index_ror.has = true;
	Map.index_ror.v = Number(Core.getAttr("index_ror"));
	} else  {
	Map.index_ror.has = false;
	}
	

    // Set up BitmapView for map
   var initbmv = false;

    if (a_mode == Map.modeNormal) {
        var ctrl = new BitmapView(Core.window);
        Map.mapBMview = ctrl;
        Map.mapBMview.move(Core.base_x, Core.base_y);
        initbmv = true;
    }
    if (a_mode == Map.modeRender) {
        initbmv = !a_bmv.initialized;
        Map.mapBMview = a_bmv;
    }
    var grid = a_mode == Map.modeNormal ? true : false;

    Map.mapGrid = new GridHandler(Map.pixelw, Map.pixelh, Map.width, Map.height, Map.numOf, "mapgrid");
    if (grid == false) {
        Map.mapGrid.gridline_w = 0;
	Map.mapGrid.gridline_h = 0;
	Map.mapGrid.calculate();
    }
    //Map.mapGrid.parent = TileMap;
    Map.mapGrid.setBitmapView(Map.mapBMview, false);

   var wpixels = 1;
   var hpixels = 1;
    if (initbmv == true) {
	wpixels = Map.mapGrid.getTotalWidth();
	hpixels = Map.mapGrid.getTotalHeight();
	//wpixels = 600;
	//hpixels = 600;

	Map.mapBMview.init(wpixels,hpixels);
    }

	Map.mapGrid.drawItemFunc = Map.mapGridDrawFunc;
    
   var base_relative_x = 0;

    if (a_mode == Map.modeNormal) {

        if (Map.totalwidth.has) {
        var maxwidth = Map.totalwidth.v-Map.width;
         if (Map.versionDate >= 270123) {
	      Map.xslider = new QScrollBar(Core.window);
         } else {
		Map.xslider = new QSlider(Core.window);
         }
			Map.xslider.move(Core.base_x, (Core.base_y + hpixels));
			Map.xslider.setOrientation(1);
			Map.xslider.resize(wpixels, 20);
			
			Map.xslider.setRange(0, maxwidth);
			Map.xslider.setSingleStep(1);
			Map.xslider.setPageStep(16);
			
			Map.xslider.valueChanged.connect(Map.xsliderFunc);
			Map.xslider.show();
    
        }

        if (Map.totalheight.has) {
        var maxheight = Map.totalheight.v-Map.height;
         if (Map.versionDate >= 270123) {
	      Map.yslider = new QScrollBar(parentWnd);
         } else {
         Map.yslider = new QSlider(Core.window);
         }
			Map.yslider.move((Core.base_x + wpixels), Core.base_y);
			Map.yslider.setOrientation(0);
			Map.yslider.resize(20, hpixels);
			
			Map.yslider.setRange(0, maxheight);
			Map.yslider.setSingleStep(1);
			Map.yslider.setPageStep(1);
			Map.yslider.setValue(maxheight); //Needs to be reverse
			
			Map.yslider.valueChanged.connect(Map.ysliderFunc);
			Map.yslider.show();
        base_relative_x = Map.yslider.width;
        }

  base_relative_x += (10 + wpixels);
    
	//Initialize grid for value selection
	var ctrl = new BitmapView(Core.window);
	Map.selBMview = ctrl;
	Map.selBMview.move(Core.base_x+base_relative_x, Core.base_y);

	Map.selGrid = new GridHandler(Map.pixelw, Map.pixelh, 16, 16, 256, "selgrid");
	//Map.selGrid.parent = TileMap;
	Map.selGrid.setBitmapView(Map.selBMview, false);
	var selwpixels = Map.selGrid.getTotalWidth();
	var selhpixels = Map.selGrid.getTotalHeight();
	Map.selBMview.init(selwpixels, selhpixels);

	Map.selGrid.drawItemFunc = Map.selGridDrawFunc;

    }

	if (Map.versionDate < 260206) {
		Map.dataCacheEnable = false;
	}

   if (Map.dataCacheEnable == true) {
   var cachesz = 16;

       // Attempt to calculate the range of bytes read
	if (Map.totalwidth.has == false) {
		cachesz = Map.entries;
	} else {
	     if (Map.totalheight.has == false) {
			cachesz = (Map.height*Map.totalwidth.v);
	      } else {
		   cachesz = (Map.totalheight.v*Map.totalwidth.v);
	      }
	}

       var a = Map.index_mul * Map.entries;
       if (cachesz < a) {cachesz = a;}
       var b = Map.parentindex_mul * 256;
       if (cachesz < b) {cachesz = b;}


	  Map.dataCacheSz = cachesz;
	  Map.dataCache = Core.getByteArray(0, Map.dataCacheSz);
  }

    if (Map.versionDate < 260301) {
        Map.simpleMode = true;
    } else {

    // Initialize subitem child elements
//    var list = Core.childElementIndexList("subitem");
	var list = Core.childElementIndex("subitem");
	if (list >= 0) {
		Map.paramDispatchList[Map.renderArr.length] = [];
		Map.renderArr.push(list);
	}
	

   // Initialize child elements for rendering graphics
	if (Map.renderArr.length > 0) {
		for (var ix = 0; ix < Map.renderArr.length; ix++) {
			var elmIndex = Map.renderArr[ix];
			var param = {};
			var hnd = Core.initRender(elmIndex, Map.mapBMview, param);
			Map.renderHndArr[ix] = hnd;
		}
	} else {
      // If none are found, set to simple mode
      Map.simpleMode = true;
   }

	// Register PARAM child element/data and keep in memory
  // (Call "fetch" function of its data type.)
  
	var param_ei = Core.childElementIndex("parameter");
	if (param_ei >= 0) {
		var data = Core.fetchElementData(param_ei);
		var dest_param = "index";
		var index_src = "index";
     var has_index_src = false;
		var val_mul = 1;

      // Read attributes specifically related to parameters.
      // map.dest: Name of parameter to set.
      // If not provided it will override "index".
		if (Core.hasAttr("map.dest", param_ei)) {
		dest_param = Core.getAttr("map.dest", param_ei);
		}
		if (Core.hasAttr("map.index_src", param_ei)) {
      // Input parameter to use as Array index
		index_src = Core.getAttr("map.index_src", param_ei);
     has_index_src = true;
		}
		if (Core.hasAttr("map.val_mul", param_ei)) {
      // map.val_mul: Multiply source value
		val_mul = Number(Core.getAttr("map.val_mul", param_ei));
		}

		var paramset = {};
		paramset.dest_param = dest_param;
		paramset.data = data;
		paramset.has_index_src = has_index_src;
		paramset.index_src = index_src;
		paramset.val_mul = val_mul;
		Map.paramSetup.push(paramset);

	}
   } // versionDate check

    if (Map.simpleMode == true) {
       Map.font[0] = [
"OOO", "__O", "OOO", "OOO", "O_O", "OOO", "_OO", "OOO",
"O_O",  "__O", "__O",  "__O",  "O_O", "O__",  "O__",  "__O", 
"O_O", "__O",  "OOO", "OOO", "OOO","OOO","OOO","__O",
"O_O", "__O", "O__",  "__O",   "__O",  "__O", "O_O", "_O_",
"OOO","__O", "OOO", "OOO", "__O",  "OOO","OOO", "_O_"];
        Map.font[1] = [
"OOO","OOO","_O_",  "OO_","_OO","OO_","OOO","OOO",
"O_O", "O_O",  "O_O",  "O_O","O__", "O_O","O__", "O__",
"OOO","OOO","OOO", "OO_", "O__","O_O","OOO","OOO",
"O_O", "__O", "O_O",  "O_O", "O__", "O_O","O__","O__",
"OOO","OO_",  "O_O", "OO_", "_OO", "OO_","OOO","O__"];

    }
  
    if (a_mode == Map.modeNormal) {
	var index = Map.getValue(0);
	Map.selGrid.setIndex(index);
	Map.mapBMview.mousePress.connect(Map.mapClickFunc);
	Map.selBMview.mousePress.connect(Map.selClickFunc);

	// Refresh everything if we're in normal data type mode.
	// If map.js is loaded in Render mode, map will be redrawn in updateRender.
	Map.redrawMapGrid(true, true);

	Map.mapBMview.refresh();
	Map.mapBMview.show();

	Map.selGrid.redraw();
   if (Map.simpleMode == false) {
	if (Map.multiParam == true) {
		for (var r_index = 0; r_index < Map.renderArr.length; r_index++) {
			Core.updateRender(Map.renderHndArr[r_index], Map.selBMview, Map.paramDispatchList[r_index]);
			Map.paramDispatchList[r_index].length = 0;
		}
	}
   }
	Map.selBMview.refresh();
	Map.selBMview.show();
    }

}

function updateRender(a_bmv, a_param) {

	Map.mapBMview = a_bmv;
	if (Array.isArray(a_param) == false) {
		Map.parentParam = a_param;
		Map.redrawMapGrid(true, false);
	} else {
		for (var ix = 0; ix < a_param.length; ix++) {
			Map.parentParam = a_param[ix];
			Map.redrawMapGrid(true, false);
		}
	}

   // Dispatch all parameters to child elements at once
   // in one API call instead of multiple API calls.
   // This way its much faster.
   if ((Map.simpleMode == false) && (Map.multiParam == true)) {
		for (var r_index = 0; r_index < Map.renderArr.length; r_index++) {
			Core.updateRender(Map.renderHndArr[r_index], Map.mapBMview, Map.paramDispatchList[r_index]);
			Map.paramDispatchList[r_index].length = 0;
		}
   }
}

Map.xsliderFunc = function(a_value) {
     Map.current_x = a_value;
     Map.redrawMapGrid(false, true);
     Map.mapBMview.refresh();
}

Map.ysliderFunc = function(a_value) {
     Map.current_y = (Map.yslider.maximum - a_value);
     Map.redrawMapGrid(false, true);
     Map.mapBMview.refresh();
}


Map.redrawMapGrid = function(a_drawGrid, a_dispatch) {
  
    if (a_drawGrid == true) {
	Map.mapGrid.redraw();
    } else {
	for (var celly = 0; celly < Map.mapGrid.height; celly++) {
	for (var cellx = 0; cellx < Map.mapGrid.width; cellx++) {
		Map.mapGrid.redrawCell(celly, cellx);
	}
	}
    }

   if ((a_dispatch == true) && (Map.simpleMode == false) && (Map.multiParam == true)) {
		for (var r_index = 0; r_index < Map.renderArr.length; r_index++) {
			/*for (var ix = 0; ix < Map.paramDispatchList[r_index].length; ix++) {
				Core.updateRender(Map.renderHndArr[r_index], Map.mapBMview, Map.paramDispatchList[r_index][ix]);
			}*/
			Core.updateRender(Map.renderHndArr[r_index], Map.mapBMview, Map.paramDispatchList[r_index]);
			Map.paramDispatchList[r_index].length = 0;
		}
   }
}

Map.mapClickFunc = function(a_buttons, a_y, a_x) {
	Map.mapGrid.eventMousePress(a_buttons, a_y, a_x);
	var index = Map.getIndex();
	
	var value = Map.getValue(index);
	Map.selGrid.setIndex(value);
	Map.selGrid.redrawGrid();
	Map.selBMview.refresh();
}

Map.selClickFunc = function(a_buttons, a_y, a_x) {
	Map.selGrid.eventMousePress(a_buttons, a_y, a_x);
	var value = Map.selGrid.getIndex();
	var index = Map.getIndex();

	Map.setValue(index, value);
	Map.mapGrid.redrawCurrentCell();
	if ((Map.simpleMode == false) &&  (Map.multiParam == true)) {
		for (var r_index = 0; r_index < Map.renderArr.length; r_index++) {
			Core.updateRender(Map.renderHndArr[r_index], Map.mapBMview, Map.paramDispatchList[r_index]);
			Map.paramDispatchList[r_index].length = 0;
		}
	}
	Map.mapBMview.refresh();
}

Map.getIndex = function() {
  var rowsize;
  if (Map.totalwidth.has == false) {
		rowsize = Map.width;
	} else {
		rowsize = Map.totalwidth.v;
	}
   return(((Map.mapGrid.current_y+Map.current_y) * rowsize) + Map.mapGrid.current_x+Map.current_x);
}

Map.getValue = function(a_index) {
  if (Map.dataCacheEnable == true) {
       Map.checkCacheOk(a_index);
       return( Map.dataCache[a_index] );
   } else {
       return( Core.getByte(a_index) );
   }
}

Map.setValue = function(a_index, a_val) {
  if (Map.dataCacheEnable == true) {
    Map.checkCacheOk(a_index);
    Map.dataCache[a_index] = a_val;
  }
  Core.setByte(a_index, a_val);
}

Map.checkCacheOk = function(a_index) {

    if (a_index < Map.dataCacheSz) {return true;}
 //  print("over: " + a_index + " : " + Map.dataCacheSz);
    // Expand the cache
    var cachesz = Math.ceil(a_index/Map.cacheExpandSize)*Map.cacheExpandSize;
    Map.dataCacheSz = cachesz;
    // Re-read entire buffer
    Map.dataCache = Core.getByteArray(0, Map.dataCacheSz);
    return false;
}

Map.mapGridDrawFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {

   a_cell_x += Map.current_x;
   a_cell_y += Map.current_y;

	if (Map.totalwidth.has == true) {
		a_index = (a_cell_y * Map.totalwidth.v) + a_cell_x;
	}

   // if "index" param is set from parent, use as a relative pointer that can be modified through
   // various attributes.
   // "index" is usually a value read from the file in the parent element.
	var byteindex = 0;
	if (Map.parentParam.hasOwnProperty("index")) {
		byteindex = Map.parentParam.index;
	}
	
	//Simple operation: Multiply the index passed from parent element.
	byteindex = byteindex*Map.parentindex_mul;

	//Operations done on a_index:
	var bitsize = Map.index_bitsize;
	if (Map.index_ror.has == true) {
		//Simple operation: Rotate right
		var ror = Map.index_ror.v;
		var back = a_index & ((1<<ror)-1);
		a_index = (a_index >> ror) | (back<<(bitsize-ror));
	}

	//Simple operation: Mul
	a_index = a_index*Map.index_mul;

	var cell_value = Map.getValue(a_index+byteindex);
	
	Map.renderCellCommon(Map.mapBMview, cell_value, a_index+byteindex, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2);
}

Map.selGridDrawFunc = function(a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {
	Map.renderCellCommon(Map.selBMview, a_index, a_index, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2);
}

Map.renderCellCommon = function(a_bmv, a_index, a_parentindex, a_page, a_cell_y, a_cell_x, a_y1, a_x1, a_y2, a_x2) {
  
   // clone the param object
	var obj = Map.parentParam;
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

   // if there's already an x property, add.
	if (param.hasOwnProperty("x")) {
		param.x = Number(param.x) + a_x1;
	} else {
		param.x = a_x1;
	}

   // if there's already an y property, add.
	if (param.hasOwnProperty("y")) {
		param.y += a_y1;
	} else {
		param.y = a_y1;
	}
        param.x2 = param.x + a_x2;
        param.y2 = param.y + a_y2;
        param.cellx = a_cell_x;
        param.celly = a_cell_y;

  if (param.x >= a_bmv.width) {return;}
  if (param.y >= a_bmv.height) {return;}


	if (Map.paramSetup.length > 0) {
		for (var count = 0; count < Map.paramSetup.length; count++) {

		var setup = Map.paramSetup[count];
		var dest_param  = setup.dest_param;
		var value = 0;
		
		if (setup.hasOwnProperty("has_index_src")) {
		if (setup.has_index_src == true) {
		if (setup.hasOwnProperty("index_src")) {
			var paramname = setup.index_src;
			var index = param[paramname];
			value = setup.data[index];
			value = value * setup.val_mul;
		}
		}
		}

		param[dest_param] = value;

		}
	}
	
	if (Map.simpleMode == false) {
	if (Map.renderArr.length > 0) {

		for (var r_index = 0; r_index < Map.renderArr.length; r_index++) {

			if (Map.multiParam == false) {
				Core.updateRender(Map.renderHndArr[r_index], a_bmv, param);
			} else {
				Map.paramDispatchList[r_index].push(param);
			}

		}

	}
    
    } else {
        // Draw a colored box displaying the value
        var v = param.index;
        var color = ((v&1) << 23) | ((v&2)<<14) | ((v&4)<<5) |
                         ((v&8) << 19) | ((v&16)<<10) | ((v&32)<<1) |
                         ((v&64) << 15) | ((v&128) << 6);
        var ypixels = Map.pixelh;
        var xpixels = Map.pixelw;
        var totalpixels = ypixels*xpixels;
        var buffer = new Array(totalpixels);
        for (var filli = 0; filli < totalpixels; filli++) {
            buffer[filli] = color;
        }
        var digit = [];
        digit[0] = param.index >> 4;
        digit[1] = param.index & 0xF;
	var propx = xpixels/8;
	var digitxpixels = Math.floor(propx*3);
        for (var d = 0; d < 2; d++) {
           var fblock = digit[d] >> 3;
           var f_offset = (digit[d] & 7);
	
           for (var y = 0; y < ypixels; y++) {
               var fonty = Math.floor((y / ypixels) * 6);
               if (fonty < 5) {
                   var f_entry = f_offset+(fonty*8);
                   var fdata = Map.font[fblock][f_entry];

                   var basex = Math.floor(propx+(Math.floor(propx*4)*d));
                   for (var x = 0; x < digitxpixels; x++) {
                       var fontx = Math.floor((x / digitxpixels)*3);
                        if (fontx < 3) {
                           if (fdata.charAt(fontx) == 'O') {
                              buffer[(y*xpixels)+x+basex] ^= 0xFFFFFF;
                           }
                        }
                   }
               }
           }
        }
	if (Map.versionDate >= 260131) {
		a_bmv.drawBuffer(a_y1, a_y2, a_x1, a_x2, buffer);
	} else {
		var bufp = 0;
		for (var y = a_y1; y <= a_y2; y++) {
		for (var x = a_x1; x <= a_x2; x++) {
			a_bmv.setPixel(y, x, buffer[bufp++]);
		}
		}
	}
    }

}