//GridHandler. Can be used with BitmapView object.

//Call "setBitmapView(object, handleMouse)" to draw to a BitmapView object.
//You can also override the drawing methods of GridHandler yourself:
//	setPixel(Y, X, 24BitColor)
//	drawLineX(Y, X, X2, 24BitColor)
//	drawLineY(Y, Y2, X, 24BitColor)
//	drawBox(Y, Y2, X, X2, 24BitColor)
//	drawBuffer(Y, Y2, X, X2, 24BitColorArray)

//These functions do nothing if there's nothing to draw to.

//You can override method drawItemFunc(cell_index, cell_page, cell_y, cell_x, y1, x1, y2, x2)
//to draw the contents of cells. x1 and x2 is the first and last x coordinates in the bitmap to draw. y1 and y2 are the first and last y.
//You can call the functions listed above from here.
//It's possible to handle drawing yourself. This function does nothing by default.

//You can set up method drawDisabledFunc(cell_index, cell_page, cell_y, cell_x, y1, x2, y2, x2)
//to draw the contents of a disabled or out-of-boundary cell. By default, it tries to fill the box with the parent window's background color.

function GridHandler(argcellw, argcellh, argw, argh, arg_entries, a_accessname) {
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
	if (a_accessname == undefined) {
		a_accessname = "grid";
	}

   this.bmvObject = 0;
   this.drawCmd = [];
	this.bgcolor = 0;
	this.currentcolor = Number("0x" + Core.customize(a_accessname+".selcolor", "CFCFCF", "grid.selcolor"));
   this.rangecolor = 0x8F8F8F;
	this.gridcolor = Number("0x" + Core.customize(a_accessname+".color", "2F2F2F", "grid.color"));
	this.selectable = true;
	this.multiPage = false;
   this.multiSelect = false;
   this.rangeActive = false;
   this.rangeStart = 0;
   this.rangeEnd = 0;
	this.current_y = 0;
	this.current_x = 0;
	this.current_page = 0;
	this.gridline_w = Number(Core.customize(a_accessname+".linewidth", "2", "grid.linewidth"));
	this.gridline_h = Number(Core.customize(a_accessname+".lineheight", "2", "grid.lineheight"));
	this.redrawCellOnSelect = 0;	//0 = None (Grid Only), 1 = Old cell and new cell, 2 = Redraw all cells on select (slow)
	//this.redrawGridOnSelect = 1; (To be implemented) //0 = Do nothing. 1 = Draw relevant parts. 2 = Redraw whole grid.
	
	this.setPixel = function(y, x, color) {}
	this.drawLineX = function(y, x, x2, color) {}
	this.drawLineY = function(y, y2, x, color) {}
	this.drawBox = function(y, y2, x, x2, color) {}
	this.drawBuffer = function(y, y2, x, x2, buffer) {}
	
	this.drawItemFunc = function(cell_index, cell_page, cell_y, cell_x, y1, x1, y2, x2) {}
	this.drawDisabledFunc = function(cell_index, cell_page, cell_y, cell_x, y1, x1, y2, x2) {
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

	this.lockflag = false;
	this.fadestate = -1;
	this.fadestateAdd = 220;
	if (Core.versionDate >= 260131) {
		this.animate = true;
		this.animateTimer = new QTimer();
		this.animateTimer.start(33);
		this.animateTimer.timeout.connect(this, this.timerFunc);
		
	} else {
		this.animate = false;
	}

}

GridHandler.prototype.timerFunc = function() {
	if ((this.fadestate >= 0)  && (this.lockflag == false)){
		this.lockflag = true;
		if (this.fadestate >= 1000) {
			this.fadestate = 1000;
		}
		this.redrawGrid();
		this.bmvObject.refresh();
		if (this.fadestate >= 1000) {
			this.fadestate = -1;
		} else {
			this.fadestate += this.fadestateAdd;
		}
		this.lockflag = false;
	}
	
}

GridHandler.prototype.setEntryCount = function(a_entries) {
	var oldCount = this.entries;
    this.entries = a_entries;

    if (a_entries > oldCount) {
       for (var ec = oldCount; ec < a_entries; ec++) {
		    this.cell_enabled[ec] = true;
	    }
    }
    if (oldCount > a_entries) {
        if (this.getIndex() >= this.entries) {
            this.setIndex(this.entries-1);
        }
    }
}

GridHandler.prototype.getIndex = function() {
	var cell_index = (this.current_page*(this.width*this.height)) + (this.current_y * this.width) + this.current_x;
	return cell_index;
}

GridHandler.prototype.setIndex = function(a_index) {
	if (a_index >= this.entries) {return;}
	this.current_page = Math.floor(a_index / (this.width*this.height));
	this.current_y = Math.floor((a_index - (this.current_page * (this.width*this.height))) / this.width);
	this.current_x = a_index % this.width;
}

GridHandler.prototype.setRange = function(a_first, a_last) {
    this.rangeActive = true;
    this.rangeStart = a_first;
    this.rangeEnd = a_last;
}

GridHandler.prototype.setPage = function(a_page) {
	this.current_page = a_page;
	var index = this.getIndex();
	if (index >= this.entries) {
		this.current_x = 0;
		this.current_y = 0;
	}
}

GridHandler.prototype.eventMouseMove = function(a_buttons, a_y, a_x) {
}

GridHandler.prototype.eventMousePress = function(a_buttons, a_y, a_x) {
   if (this.selectable == false) {return;}

	var celly_click = 0;
	var cellx_click = 0;
	var celly, cellx;

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

			var range = false;
			if ((this.multiSelect == false) || ((a_buttons & 1) == 1)) {
				var old_current_y = this.current_y;
				var old_current_x = this.current_x;
				this.current_y = celly_click;
				this.current_x = cellx_click;
			} else if ((a_buttons & 2) == 2) {
				var curIndex = this.getIndex();
				if (cell_index == curIndex) {
					this.rangeActive = false;
				} else {
					range = true;
					 this.rangeActive = true;
					 this.rangeStart = curIndex;
					 this.rangeEnd = cell_index;
				}
			}
	
			this.fadestate = 0;
			if (this.redrawCellOnSelect == 2) {
				this.redraw();
			} else if (this.redrawCellOnSelect == 1) {
				this.redrawCell(old_current_y, old_current_x);
				this.redrawCell(celly_click, cellx_click);

				   if (range == true) {
					for (var rangeCell = this.rangeStart; rangeCell < this.rangeEnd; rangeCell++) {
					   var celly = 0;
					   var cellx = 0;
					   this.redrawCell(celly, cellx);
					}
				}
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
	this.drawBuffer = function(y1, y2, x1, x2, buffer) {this.bmvObject.drawBuffer(y1, y2, x1, x2, buffer);}


/* test
    this.drawBox = function(y1, y2, x1, x2, color) {
        this.drawCmd.push(this.bmvObject.drawCmdBox, y1, y2, x1, x2, color);
    }
*/

	if (a_handleMouse == true) {
		this.bmvObject.mousePress.connect(this, this.eventMousePress);
		/*if (Core.versionDate >= 260109) {
			this.bmvObject.mouseMove.connect(this, this.eventMouseMove);
		}*/
	}
	
	//this.bmvObject.resize(this.cell_start_x[this.width]+this.gridline_w, this.cell_start_y[this.height]+this.gridline_h);
}

GridHandler.prototype.redrawCurrentCell = function() {
	this.redrawCell(this.current_y, this.current_x);
}

GridHandler.prototype.checkActiveCell = function(a_index) {
	if (this.cell_enabled[a_index] == false) {
		return false;
	} else if (a_index >= this.entries) {
		return false;
	}
	return true;
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
		var x1 = this.cell_start_x[a_cellx];
		var x2 = this.cell_start_x[a_cellx+1]-1+this.gridline_w;
		var y1 = this.cell_start_y[a_celly];
		var y2 = this.cell_start_y[a_celly+1]-1+this.gridline_h;
		this.drawDisabledFunc(this.calculateIndex(a_celly, a_cellx, this.current_page), this.current_page, a_celly, a_cellx, y1, x1, y2, x2);
	} else {
		var x1 = this.cell_start_x[a_cellx] + this.gridline_w;
		var x2 = this.cell_start_x[a_cellx+1]-1;
		var y1 = this.cell_start_y[a_celly] + this.gridline_h;
		var y2 = this.cell_start_y[a_celly+1]-1;
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

	var currentcolor = this.currentcolor;
	if (this.animate == true) {
		if ((this.fadestate < 1000) && (this.fadestate >= 0)) {
			var degree = this.fadestate / 1000;
			var b = ((this.gridcolor & 0xFF) * (1-degree)) + ((this.currentcolor & 0xFF) * degree);
			var g = (((this.gridcolor >> 8) & 0xFF) * (1-degree)) + (((this.currentcolor >> 8) & 0xFF) * degree);
			var r = (((this.gridcolor >> 16) & 0xFF) * (1-degree)) + (((this.currentcolor >> 16) & 0xFF) * degree);
			currentcolor = Math.floor(b) + (Math.floor(g) << 8) + (Math.floor(r) << 16);
		}
	}

	var x, x2, y, y2;

	var colortable = [0, this.gridcolor, this.rangecolor, currentcolor];
	
	var singleGridLineW = (this.gridline_w == 1);
	var singleGridLineH = (this.gridline_h == 1);
	var previousType = 0;
	var aboveType = 0;
	var diagonalType = 0;
	// var drawv = false;
	// var drawh = false;
	var typev = 0;
	var typeh = 0;
	var vert_y1;
	var horz_x1;

	for (var celly = 0; celly < this.height+1; celly++) {
	previousType = 0;
	aboveType = 0;
	for (var cellx = 0; cellx < this.width+1; cellx++) {
	
    //  drawh = false;
    //  drawv = false;
      typev = 0;
      typeh = 0;
      diagonalType = aboveType;
      aboveType = 0;
      
      if (previousType > 0) {
     //     drawv = true;
          typev = previousType;
	   previousType = 0;
      }

      if (cellx < this.width) {
      if (celly >= 1) {
          var aboveEntry = this.calculateIndex(celly-1, cellx);
          if (this.checkActiveCell(aboveEntry) == true) {
      //        drawh = true;
              if ((this.selectable == true) && (aboveEntry == this.getIndex())) {
                  aboveType = 3;
              } else if ((this.rangeActive == true) && (aboveEntry >= this.rangeStart) && (aboveEntry <= this.rangeEnd)) {
                  aboveType = 2;
             } else {
                  aboveType = 1;
             }
             typeh = aboveType;
          }
      }

     if (celly < this.height) {
	       var thisentry = this.calculateIndex(celly, cellx);
          var thisActive = this.checkActiveCell(thisentry);
          if (thisActive) {
       //      drawv = drawh = true;
       
             if ((this.selectable == true) && (thisentry ==  this.getIndex())) {
                     typev = typeh = previousType = 3;
             } else if ((this.rangeActive == true) && (thisentry >= this.rangeStart) && (thisentry <= this.rangeEnd)) {
                 if (typev < 2) {
                     typev = 2;
                 }
                 if (typeh < 2) {
                     typeh = 2;
                 }
                previousType = 2;
             } else {
                 if (typev < 1) {
                     typev = 1;
                 }
                 if (typeh < 1) {
                     typeh = 1;
                 }
                 previousType = 1;
             }
             
          }
      }
      }
      
      
     if ((typev > typeh) && (typev > diagonalType)) {
         vert_y1 = 0;
         horz_x1 = this.gridline_w;
     } else {
         vert_y1 = this.gridline_h;
         if (diagonalType > typeh) {
             horz_x1 = this.gridline_w;
         } else {
             horz_x1 = 0;
         }
     }

     if (typev > 0) {
		x = this.cell_start_x[cellx];
		colorv = colortable[typev];
		if (singleGridLineW == true) {
			this.drawLineY(this.cell_start_y[celly]+vert_y1, this.cell_start_y[celly+1]-1, x, colorv);
		} else {
			this.drawBox(this.cell_start_y[celly]+vert_y1, this.cell_start_y[celly+1]-1, x, x+this.gridline_w-1, colorv);
		}
      }
      if (typeh > 0) {
		y = this.cell_start_y[celly];
		colorh = colortable[typeh];
		if (singleGridLineH == true) {
			this.drawLineX(y, this.cell_start_x[cellx]+horz_x1, this.cell_start_x[cellx+1]+this.gridline_w-1, colorh);
		} else {
			this.drawBox(y, y+this.gridline_h-1, this.cell_start_x[cellx]+horz_x1, this.cell_start_x[cellx+1]+this.gridline_w-1, colorh);
		}
	}

    } // cell x loop
    }  // cell y loop

}

GridHandler.prototype.redraw = function() {

   //var bench1 = Core.getTimer();
	for (var celly = 0; celly < this.height; celly++) {
	for (var cellx = 0; cellx < this.width; cellx++) {
		this.redrawCell(celly, cellx);
	}
	}
	
	this.redrawGrid();

   /*this.bmView.drawCommand(this.drawCmd);
   this.drawCmd = []; */

   /*var bench2 = Core.getTimer();
   print(bench2 - bench1);*/
   
}

GridHandler.prototype.calculate = function() {
   var celly, cellx;

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
