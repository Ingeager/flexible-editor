

CommonStringRender = {};

    /*CommonSRFont[6] = [
"OOOOO", "____O", "OOOOO", "OOOOO", "O___O", "OOOOO", "_OOOO", "OOOOO",
"O___O",  "____O", "____O",  "____O",  "O___O", "O____",  "O____",  "____O", 
"O___O",  "____O", " __OO_", "____O",  "O___O", "O____",  "O____",  "___O_",
"O___O", "____O",  "__OO_", "OOOOO", "OOOOO","OOOO_","OOOO_","__O__",
"O_O", "__O", "O__",  "__O",   "__O",  "__O", "O_O", "_O_",
"OOO","__O", "OOO", "OOO", "__O",  "OOO","OOO", "_O_"];*/

	CommonSRFont = new Array(16);
	CommonSRFont[0] = [];
	CommonSRFont[1] = [];
	CommonSRFont[2] = [];
	CommonSRFont[3] = [];
	CommonSRFont[4] = [
"___", "_O_", "O_O", "O_O", "_OO", "O_O", "_O_", "_O_",
"___", "_O_", "O_O", "OOO", "OO_", "__O", "OO_", "O_",
"___", "_O_", "___", "O_O", "_O_", "_O_", "OOO", "___",
"___", "___", "___", "OOO", "_OO", "O__", "O_O", "___",
 "___", "_O_", "___", "O_O", "OO_", "O_O", "OOO", "___"];
        CommonSRFont[5] = [
"__O","O__","___",  "___","___","___","___","__O",
"_O_", "_O_",  "O_O",  "_O_","___", "___","___", "_O_",
"_O_","_O_","_O_", "OOO", "___","OOO","___","_O_",
"_O_", "_O_", "O_O",  "_O_", "_O_", "___","OO_","O__",
"__O","O__",  "___", "___", "OO_", "___","OO_","O__"];
       CommonSRFont[6] = [
"OOO", "__O", "OOO", "OOO", "O_O", "OOO", "_OO", "OOO",
"O_O",  "__O", "__O",  "__O",  "O_O", "O__",  "O__",  "__O", 
"O_O", "__O",  "OOO", "OOO", "OOO","OOO","OOO","__O",
"O_O", "__O", "O__",  "__O",   "__O",  "__O", "O_O", "_O_",
"OOO","__O", "OOO", "OOO", "__O",  "OOO","OOO", "_O_"];
        CommonSRFont[7] = [
"OOO","OOO","___",  "___","__O","___", "O__","_O_",
"O_O", "O_O",  "O__",  "O__","_O_", "OOO","_O_", "__O",
"OOO","OOO","___", "___", "O__","___","__O","_O_",
"O_O", "__O", "O__",  "O__", "_O_", "OOO","_O_","___",
"OOO","OO_",  "___", "O__", "__O", "___","O__","_O_"];
         CommonSRFont[8] = [
"_O_","_O_",  "OO_","_OO","OO_","OOO","OOO","_OO",
"O_O", "O_O",  "O_O","O__", "O_O","O__", "O__","O__",
"OOO","OOO", "OO_", "O__","O_O","OOO","OOO","O_O",
"O_O", "O_O",  "O_O", "O__", "O_O","O__","O__","O_O",
"_OO","O_O", "OO_", "_OO", "OO_","OOO","O__","_OO"];
      CommonSRFont[9] = [
"O_O", "_O_", "__O", "O_O", "O__", "O_O", "O_O", "_O_",
"O_O", "_O_", "__O", "O_O", "O__", "OOO", "OOO", "O_O",
"OOO", "_O_", "__O", "OO_", "O__", "O_O", "OOO", "O_O",
"O_O", "_O_", "O_O", "O_O", "O__", "O_O", "O_O", "O_O",
 "O_O", "_O_", "_O_", "O_O", "OOO", "O_O", "O_O", "_O_"];
    CommonSRFont[10] = [
"OO_", "_O_", "OO_", "_OO", "OOO", "O_O", "O_O", "O_O",
"O_O", "O_O", "O_O", "O__", "_O_", "O_O", "O_O", "O_O",
"OO_", "O_O", "OO_", "_O_", "_O_", "O_O", "O_O", "OOO",
"O__", "O_O", "O_O", "__O", "_O_", "O_O", "_O_", "OOO",
 "O__", "_OO", "O_O", "OO_", "_O_", "_O_", "_O_", "_O_"];
    CommonSRFont[11] = [
"O_O", "O_O", "OOO", "OO_", "O__", "_OO", "_O_", "___",
"O_O", "O_O", "__O", "O__", "O__", "__O", "O_O", "___",
"_O_", "_O_", "_O_", "O__", "_O_", "__O", "___", "___",
"O_O", "_O_", "O__", "O__", "_O_", "__O", "___", "___",
 "O_O", "_O_", "OOO", "OO_", "__O", "_OO", "___", "OOO"];
      CommonSRFont[12] = [
"O__","_O_",  "OO_","_OO","OO_","OOO","OOO","_OO",
"_O_", "O_O",  "O_O","O__", "O_O","O__", "O__","O__",
"___","OOO", "OO_", "O__","O_O","OOO","OOO","O_O",
"___", "O_O",  "O_O", "O__", "O_O","O__","O__","O_O",
"___","O_O", "OO_", "_OO", "OO_","OOO","O__","_OO"];
   CommonSRFont[13] = [
"O_O", "_O_", "__O", "O_O", "O__", "O_O", "O_O", "_O_",
"O_O", "_O_", "__O", "O_O", "O__", "OOO", "OOO", "O_O",
"OOO", "_O_", "__O", "OO_", "O__", "O_O", "OOO", "O_O",
"O_O", "_O_", "O_O", "O_O", "O__", "O_O", "O_O", "O_O",
 "O_O", "_O_", "_O_", "O_O", "OOO", "O_O", "O_O", "_O_"];
    CommonSRFont[14] = [
"OO_", "_O_", "OO_", "_OO", "OOO", "O_O", "O_O", "O_O",
"O_O", "O_O", "O_O", "O__", "_O_", "O_O", "O_O", "O_O",
"OO_", "O_O", "OO_", "_O_", "_O_", "O_O", "O_O", "OOO",
"O__", "O_O", "O_O", "__O", "_O_", "O_O", "_O_", "OOO",
 "O__", "_OO", "O_O", "OO_", "_O_", "_O_", "_O_", "_O_"];
    CommonSRFont[15] = [
"O_O", "O_O", "OOO", "_O_", "_O_", "_O_", "___", "___",
"O_O", "O_O", "__O", "O__", "_O_", "__O", "_O_", "___",
"_O_", "_O_", "_O_", "_O_", "_O_", "_O_", "O_O", "___",
"O_O", "_O_", "O__", "O__", "_O_", "__O", "___", "___",
 "O_O", "_O_", "OOO", "_O_", "_O_", "_O_", "___", "___"];

CommonStringRender.fontW = 4;
CommonStringRender.fontH = 5;

CommonStringRender.initBMV = function(a_bitmapView, a_stringlen, a_width, a_height, a_charperline) {

	var width;
	var height = a_height;
	var charperline;
	if (a_charperline == undefined) {
		charperline = Math.floor(512/a_width);
	} else {
		charperline = a_charperline;
	}
	if (a_stringlen < charperline) {
		width = a_stringlen*a_width;
	} else {
		width = (charperline*a_width) + Math.ceil(a_width/CommonStringRender.fontW);
		height = Math.ceil(a_stringlen/charperline)*a_height;
	}
	a_bitmapView.init(width, height);
	a_bitmapView.refresh();
	a_bitmapView.show();
}

CommonStringRender.drawStringParam = function(a_string, a_bitmapView,  a_param, a_width, a_height, a_ignoreindex) {

	if (a_ignoreindex == undefined) {
		a_ignoreindex = false;
	}

	var fgcolor_default = Number("0x" + Core.customize("color1", "FFFFFF"));
	
	var param_arr = [];
	if (Array.isArray(a_param) == false) {
		param_arr.push(a_param);
	} else {
		param_arr = a_param;
	}
	
	for (var par_ix = 0; par_ix < param_arr.length; par_ix++) {

		var v_param = param_arr[par_ix];
		
		var bgcolor = 0;
		var fgcolor = fgcolor_default;

		if (v_param.hasOwnProperty("palette")) {
			var index = 0;
			if (v_param.hasOwnProperty("paletteindex")) {
				index = v_param.paletteindex;
			}
			fgcolor = v_param.palette[0];
			if (v_param.hasOwnProperty("paletteentries")) {
			var entries = Number(v_param.paletteentries);
				if (entries >= 2) {
				bgcolor = v_param.palette[1];
				}
			}
		}

		var v_string = a_string;
		if (a_ignoreindex == false) {
			if (v_param.hasOwnProperty("index")) {
				var ix = Number(v_param.index);
				if (ix < v_string.length) {
					v_string = a_string[ix];
				} else {
					v_string = " ";
				}
			}
		}

		var base_x = 0;
		var base_y = 0;

		if (v_param.hasOwnProperty("x")) {
			base_x = Number(v_param.x);
		}
		if (v_param.hasOwnProperty("y")) {
			base_y = Number(v_param.y);
		}

		CommonStringRender.drawString(v_string, a_bitmapView, base_x, base_y, a_width, a_height, fgcolor, bgcolor);
	}
}


CommonStringRender.drawString = function(a_string, a_bitmapView, a_x, a_y,  a_width, a_height, a_fgcolor, a_bgcolor) {
    var bmwidth = a_bitmapView.width;
    var bmheight = a_bitmapView.height;
    var currentx = a_x;
    var currenty = a_y;

    var char_ix = 0;
    var statusok = true;
    var chara = 0;

    while (statusok == true) {
        if (char_ix >= a_string.length) {
            statusok = false;
        }
        if ((currentx+(a_width)-1) >= bmwidth) {
            currentx = 0;
            currenty += a_height;
        }
        if ((currenty+(a_height)-1) >= bmheight) {
            statusok = false;
        }
        if (statusok) {
            chara = a_string[char_ix];
	    CommonStringRender.drawChar(a_bitmapView, currentx, currenty,  chara, a_width, a_height, a_fgcolor, a_bgcolor);
        }
        char_ix++;
        currentx += a_width;
    }
}

CommonStringRender.drawChar = function(a_bmv, a_x, a_y, a_char, a_width, a_height, a_fgcolor, a_bgcolor) {

 
        var ypixels = a_height;
        var xpixels = a_width;
        var totalpixels = ypixels*xpixels;
        var buffer = new Array(totalpixels);
        for (var filli = 0; filli < totalpixels; filli++) {
            buffer[filli] = a_bgcolor;
        }
    	var propx = xpixels/(CommonStringRender.fontW+1);
   	var digitxpixels = xpixels;
       
           var charcode = a_char.charCodeAt(0);
           if ((charcode < 0x20) || (charcode >= 0x80)) {
               charcode = 0x20;
           }
           var fblock = charcode >> 3;
           var f_offset = charcode & 7;
           var basex = Math.floor(propx);
	
           for (var y = 0; y < ypixels; y++) {
               var fonty = Math.floor((y / ypixels) * (CommonStringRender.fontH+1));
               if (fonty < CommonStringRender.fontH) {
                   var f_entry = f_offset+(fonty*8);
                   var fdata = CommonSRFont[fblock][f_entry];
                   for (var x = 0; x < digitxpixels; x++) {
                       var fontx = Math.floor((x / digitxpixels)*CommonStringRender.fontW);
                        if (fontx < CommonStringRender.fontW) {
                           if (fdata.charAt(fontx) == 'O') {
                              buffer[(y*xpixels)+x+basex] = a_fgcolor;
                           }
                        }
                   }
               }
           }
        
	var a_y2 = a_y + a_height-1;
	var a_x2 = a_x + a_width-1;
	if (Core.versionDate >= 260131) {
		a_bmv.drawBuffer(a_y, a_y2, a_x, a_x2, buffer);
	} else {
		var bufp = 0;
		for (var y = a_y; y <= a_y2; y++) {
		for (var x = a_x; x <= a_x2; x++) {
			a_bmv.setPixel(y, x, buffer[bufp++]);
		}
		}
	}

}