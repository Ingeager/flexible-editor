//FLEX_INCLUDE "common_grid.js"

CommonPalette = function() {
	this.indexed = false;
	this.indexedPalette = [];
	this.indexedPaletteSize = 0;
	this.bitSize = 24;	//Bit size for each index. Doesn't have to correspond to sum of channelBitSizes.
	this.channels = 3;
	this.channelBitSizes = [8, 8, 8];	//Channel bit sizes in order R, G, B.
	this.channelBitLSBIndex = [0, 8, 16];  //LSB position in data of LSB bit of each channel in order: R, G, B.
							//(Does not have to be in increasing value, you can do [16, 8, 0] for example.)
	this.bigEndian = false;     // (To be implemented)
	this.palGrid = {};
	this.BMView = {};
	this.cslider = [];
	this.valueEdit = [];
	this.sliderRef = new Array(3);
	this.valueEditRef = new Array(3);
	for (x = 0; x < 3; x++) {
		this.sliderRef[x] = [];
		this.sliderRef[x].thisRef = this;
		this.sliderRef[x].index = x;
		this.valueEditRef[x] = [];
		this.valueEditRef[x].thisRef = this;
		this.valueEditRef[x].index = x;
	}
}

CommonPalette.prototype.init = function () {

	var parentWnd = Core.window;
	this.BMView = new BitmapView(parentWnd);
	this.BMView.move(Core.base_x, Core.base_y);

	var entries = Core.getHexValueAttr("len");
	var cellsx;
	var cellsy;
	
	//cellsx = 16;
	//cellsy = 8;
	if (entries >= 0x100) {
		cellsx = 16;
		cellsy = 16;
	} else if (entries > 16) {
		cellsy = ((entries-1) >> 4)+1;
		cellsx = 16;
	} else {
		cellsy = 1;
		cellsx = entries;
	}
	
	var cellSize = 26;
	if (cellsy >= 8) {
		cellSize = 20;
	}

	this.palGrid = new GridHandler(cellSize, cellSize, cellsx, cellsy, entries);
	this.palGrid.redrawCellOnSelect = 0;
	this.palGrid.parent = this;
	this.palGrid.setBitmapView(this.BMView, false);
	var wpixels = this.palGrid.getTotalWidth();
	var hpixels = this.palGrid.getTotalHeight();
	this.BMView.init(wpixels,hpixels);

	this.palGrid.drawItemFunc = this.drawItemFunc;
	
	this.BMView.mousePress.connect(this, this.entryGridMousePressFunc);
	
	event.signal.connect(this, this.eventFunc);
	
	this.palGrid.redraw();
	this.BMView.refresh();
	this.BMView.show();

	if (this.indexed == false) {
		this.cslider = new Array(3);
		this.valueEdit = new Array(3);
		for (var chan = 0; chan < 3; chan++) {
			this.cslider[chan]= new QSlider(parentWnd);
			//this.cslider[chan].chnIndex = chan;
			this.cslider[chan].move(16, (Core.base_y + hpixels+20+(chan*25)));
			this.cslider[chan].setOrientation(1);
			this.cslider[chan].resize(350, 20);
			
			max = (1 << this.channelBitSizes[chan])-1;
			this.cslider[chan].setRange(0, max);
			this.cslider[chan].setSingleStep(1);
			this.cslider[chan].setPageStep(1);
			
			this.cslider[chan].valueChanged.connect(this.sliderRef[chan], this.sliderChangeFunc);
			this.cslider[chan].show();

			this.valueEdit[chan] = new QLineEdit(parentWnd);
			this.valueEdit[chan].move(this.cslider[chan].width+35, (Core.base_y + hpixels+20+(chan*25)));
			this.valueEdit[chan].resize(45, 20);
			this.valueEdit[chan].readOnly = true;
			this.valueEdit[chan].show();
		}
		
		this.cslider[0].styleSheet = "background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:1, y2:0, stop:0 rgba(0, 0, 0, 0), stop:1 rgba(255, 150, 150, 255))";
		this.cslider[1].styleSheet = "background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:1, y2:0, stop:0 rgba(0, 0, 0, 0), stop:1 rgba(150, 255, 150, 255))";
		this.cslider[2].styleSheet = "background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:1, y2:0, stop:0 rgba(0, 0, 0, 0), stop:1 rgba(150, 150, 255, 255))";
		this.valueEdit[0].styleSheet = "color: rgb(191, 0, 0)";
		this.valueEdit[1].styleSheet = "color: rgb(0, 127, 0)";
		this.valueEdit[2].styleSheet = "color: rgb(0, 0, 255)";

			
		this.updateCurrentIndex();
	} else {

		var entries = this.indexedPaletteSize;
		if ((entries < 0x100) && (entries > 0)) {

			this.palTable_BMView = new BitmapView(parentWnd);
			var y = this.BMView.y + this.BMView.height;
			this.palTable_BMView.move(Core.base_x, y+20);

			if (entries > 16) {
				cellsy = ((entries-1) >> 4)+1;
				cellsx = 16;
			} else {
				cellsy = 1;
			}

			this.palTableGrid = new GridHandler(26, 26, cellsx, cellsy, entries);
			this.palTableGrid.parent = this;
			//this.palTableGrid.redrawCellOnSelect = 0;
			this.palTableGrid.setBitmapView(this.palTable_BMView, false);
			var wpixels = this.palTableGrid.cell_start_x[this.palTableGrid.width]+this.palTableGrid.gridline_w;
			var hpixels = this.palTableGrid.cell_start_y[this.palTableGrid.height]+this.palTableGrid.gridline_h;
			this.palTable_BMView.init(wpixels,hpixels);

			this.palTableGrid.drawItemFunc = this.drawPalTableFunc;
			this.palTable_BMView.mousePress.connect(this, this.palTableGridMousePressFunc);			

			this.updateCurrentIndex();
			this.palTable_BMView.show();
		}
	
	}
	

}

CommonPalette.prototype.sliderChangeFunc = function(a_value) {
	var cpRef = this.thisRef;
	var index = this.index;
	if (cpRef.cslider[index].programChanged == true) {return;}
	var chnData = new Array(3);
	chnData[index] = a_value;
	cpRef.setColorBits(cpRef.palGrid.getIndex(), chnData, 1 << index);
	cpRef.palGrid.redrawCurrentCell();
	cpRef.BMView.refresh();
	cpRef.valueEdit[index].text = a_value;
}

CommonPalette.prototype.updateCurrentIndex = function() {
	if (this.indexed == false) {
		var rgb = new Array(this.channels);
		this.getColorBits(this.palGrid.getIndex(), rgb, 7);
		this.cslider[0].programChanged = true;
		this.cslider[1].programChanged = true;
		this.cslider[2].programChanged = true;
		this.cslider[0].setValue(rgb[0]);
		this.cslider[1].setValue(rgb[1]);
		this.cslider[2].setValue(rgb[2]);
		this.cslider[0].programChanged = false;
		this.cslider[1].programChanged = false;
		this.cslider[2].programChanged = false;
		this.valueEdit[0].text = rgb[0];
		this.valueEdit[1].text = rgb[1];
		this.valueEdit[2].text = rgb[2];
	} else {
		var index = this.palGrid.getIndex();
		var data = new Array(1);
		this.getColorBits(index, data, 1);
		indexedPaletteIndex = data[0];
		this.palTableGrid.setCurrentIndex(indexedPaletteIndex);
		
		this.palTableGrid.redraw();
		this.palTable_BMView.refresh();
		
	}
}

CommonPalette.prototype.getColorBits = function(a_index, a_dataobj, a_chn_bits) {
	var bitpos = (this.bitSize * a_index);
	var bytepos = bitpos >> 3;
	var subbitpos = bitpos & 0x7;
	var subbitpos2 = 0;
	var bytev = Core.getByte(bytepos);
	var chn_state = new Array(this.channels);
	var chn;

	for (chn = 0; chn < this.channels; chn++) {
		 chn_state[chn] = -1;
	}
	while (subbitpos2 < this.bitSize) {
		for (chn = 0; chn < this.channels; chn++) {
			
			if ((a_chn_bits & (1 << chn)) >> 0) {
				if (chn_state[chn] == -1) {
					if (subbitpos2 >= this.channelBitLSBIndex[chn]) {
						chn_state[chn] = 0;
						a_dataobj[chn] = 0;
					}
				}
			}
			
			if ((chn_state[chn] >= 0)  && (chn_state[chn] < this.channelBitSizes[chn])) {

				if (bytev & (1 << subbitpos)) {
					a_dataobj[chn] |= (1 << chn_state[chn]);
				}
				
				chn_state[chn]++;
			}
		}
		
		subbitpos2++;
		subbitpos++;
		if (subbitpos >= 8) {
			Core.getByte(bytepos, bytev);
			subbitpos = 0;
			bytepos++;
			bytev = Core.getByte(bytepos);
		}
	}

}

CommonPalette.prototype.setColorBits = function(a_index, a_dataobj, a_chn_bits) {
	var bitpos = (this.bitSize * a_index);
	var bytepos = bitpos >> 3;
	var subbitpos = bitpos & 0x7;
	var subbitpos2 = 0;
	var bytev = Core.getByte(bytepos);
	var chn_state = new Array(3);
	var chn;

	for (chn = 0; chn < this.channels; chn++) {
		chn_state[chn] = -1;
	}
	
	while (subbitpos2 < this.bitSize) {
		for (chn = 0; chn < this.channels; chn++) {
			
			if ((a_chn_bits & (1 << chn)) >> 0) {
				if (chn_state[chn] == -1) {
					if (subbitpos2 >= this.channelBitLSBIndex[chn]) {
						chn_state[chn] = 0;
					}
				}
			}
			
			if ((chn_state[chn] >= 0)  && (chn_state[chn] < this.channelBitSizes[chn])) {
				bytev &= (0xFF ^ (1 << subbitpos));
				bytev |= (((a_dataobj[chn] >> chn_state[chn]) & 1) << subbitpos);
				chn_state[chn]++;
			}
		}
		
		subbitpos2++;
		subbitpos++;
		if (subbitpos >= 8) {
			Core.setByte(bytepos, bytev);
			subbitpos = 0;
			bytepos++;
			bytev = Core.getByte(bytepos);
		}
	}
	
}

CommonPalette.prototype.getRGB = function(index)  {
	var rgb = new Array(3);
	if (this.indexed == false) {
		this.getColorBits(index, rgb, 7);
		rgb[0] = rgb[0] * (255 / ((1 << this.channelBitSizes[0])-1));
		rgb[1] = rgb[1] * (255 / ((1 << this.channelBitSizes[1])-1));
		rgb[2] = rgb[2] * (255 / ((1 << this.channelBitSizes[2])-1));

		returnvalue = (rgb[0] << 16) | (rgb[1] << 8) | rgb[2];
	} else {
		this.getColorBits(index, rgb, 1);
		indexedPaletteIndex = rgb[0];
		returnvalue = this.getIndexedRGB(indexedPaletteIndex);
	}
	
	return returnvalue;
}

CommonPalette.prototype.getIndexedRGB = function(index)  {
	var composed = (index * 3);
	return((this.indexedPalette[composed+0] << 16) | (this.indexedPalette[composed+1] << 8) | this.indexedPalette[composed+2]);
}

//Called back from the grid handler to draw the contents of each cell.
//(In this case, the "this" object refers to the GridHandler object, not the CommonPalette one.
//Therefore, we use "parent", that we set up before, to get a reference to the CommonPalette object.)
CommonPalette.prototype.drawItemFunc = function(a_index, a_page, cell_y, cell_x, y1, x1, y2, x2)  {
	var rgb = this.parent.getRGB(a_index);
	this.drawBox(y1, y2, x1, x2, rgb);
}

CommonPalette.prototype.drawPalTableFunc = function(a_index, a_page, cell_y, cell_x, y1, x1, y2, x2)  {
	var rgb = this.parent.getIndexedRGB(a_index);
	this.drawBox(y1, y2, x1, x2, rgb);
}

CommonPalette.prototype.entryGridMousePressFunc = function(a_buttons, a_y, a_x) {
	this.palGrid.eventMousePress(a_buttons, a_y, a_x);
	this.updateCurrentIndex();
}

CommonPalette.prototype.palTableGridMousePressFunc = function(a_buttons, a_y, a_x) {
	this.palTableGrid.eventMousePress(a_buttons, a_y, a_x);
	var index = this.palGrid.getIndex();
	var value = this.palTableGrid.getIndex();

	var chnData = new Array(1);
	chnData[0] = value;
	this.setColorBits(index, chnData, 1);
	this.palGrid.redraw();
	this.BMView.refresh();
}

CommonPalette.prototype.eventFunc = function(flags) {
	if (flags && event.bit.changeindex) {
		
	}
}
