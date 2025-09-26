
CommonBit = function() {
	this.ctrlCount = 0;
	this.ctrl = [];
	this.bit_ix = [];
	this.v_spacing = 19;
	this.ctrlRef = [];
	this.changeFunc = function() {};
  
	//Array support hack for v250813
	if (Core.versionDate < 250823) {
		Core.getByteWr = function(a_addr) {return(Core.getByte(a_addr+(Core.arrayIndex*Core.arrayByteSize)));}
		Core.setByteWr = function(a_addr, a_val) {Core.setByte(a_addr+(Core.arrayIndex*Core.arrayByteSize), a_val);}
	} else {
		Core.getByteWr = function(a_addr) {return(Core.getByte(a_addr));}
		Core.setByteWr = function(a_addr, a_val) {Core.setByte(a_addr, a_val);}
	}
}

CommonBit.prototype.initBitAttr = function(a_bitCount) {

  var str = Core.getAttr("bit");
  this.initString(str, ".", a_bitCount);
}

CommonBit.prototype.initString = function(a_captionStr, a_sepChar, a_bitCount) {
  var captionArr = a_captionStr.split(a_sepChar, a_bitCount);
  for (var ix = 0; ix < a_bitCount; ix++) {
    if (ix < captionArr.length) {
      var caption = captionArr[ix];
      if (caption.length > 0) {
        var LSBpos = a_bitCount-1-ix;
        this.addControl(caption, LSBpos);
      }
    }
  }
}


CommonBit.prototype.addControl = function(a_caption, a_LSBpos) {
  var ix = this.ctrlCount;
  
  this.bit_ix[ix] = a_LSBpos;
  this.ctrlRef[ix] = [];
  this.ctrlRef[ix].thisRef = this;
  this.ctrlRef[ix].index = ix;
  var parent = Core.window;
  this.ctrl[ix] = new QCheckBox(parent);
  this.ctrl[ix].text = a_caption;
  this.ctrl[ix].move(Core.base_x, Core.base_y);
  this.ctrl[ix].resize(200, 25);
  this.ctrl[ix].programChanged = false;
  this.ctrl[ix].stateChanged.connect(this.ctrlRef[ix], this.setCheckFunc);
  this.ctrl[ix].show();
  
  this.ctrlCount += 1;

  this.updateCtrl(ix);

  Core.base_y += this.v_spacing;
}


CommonBit.prototype.updateCtrl = function(a_ix) {
  var byte_ix = this.bit_ix[a_ix] >> 3;
  var sub_bit = this.bit_ix[a_ix] & 7;
  var v = ((Core.getByteWr(byte_ix) & (1<<sub_bit)) > 0);
  this.ctrl[a_ix].programChanged = true;
  this.ctrl[a_ix].setChecked(v);
  this.ctrl[a_ix].programChanged = false;

}

CommonBit.prototype.updateAll = function() {
	for (var ix = 0; ix < this.ctrlCount; ix++) {
		this.updateCtrl(ix);
	}
}

CommonBit.prototype.setCheckFunc = function(a_state) {
  var thisRef = this.thisRef;
  var ix = this.index;
  if (thisRef.ctrl[ix].programChanged == true) {return;}
  var bitv = (a_state > 0) ? 1 : 0;
  var byte_ix = thisRef.bit_ix[ix] >> 3;
  var sub_bit = thisRef.bit_ix[ix] & 7;
  var bytev = Core.getByteWr(byte_ix);
  bytev &= (0xFF ^ (1 << sub_bit));
  bytev |= (bitv << sub_bit);
  Core.setByteWr(byte_ix, bytev);
  thisRef.changeFunc(sub_bit);
}
