

CommonStringRender = {};

	CommonSRFont = new Array(16);
	CommonSRFont[0] = [];
	CommonSRFont[1] = [];
	CommonSRFont[2] = [];
	CommonSRFont[3] = [];
	CommonSRFont[4] = [
"___", "_O_", "___", "___", "___", "___", "___", "___",
"___", "_O_", "___", "___", "___", "___", "___", "___",
"___", "_O_", "___", "___", "___", "___", "___", "___",
"___", "___", "___", "___", "___", "___", "___", "___",
 "___", "_O_", "___", "___", "___", "___", "___", "___"];
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
"OOO","OOO","OOO",  "OO_","___","___","___","OOO",
"O_O", "O_O",  "O_O",  "O_O","___", "___","___", "O__",
"OOO","OOO","O_O", "OO_", "___","OOO","___","OOO",
"O_O", "__O", "O_O",  "O_O", "OO_", "___","OO_","O__",
"OOO","OO_",  "OOO", "OO_", "O__", "___","OO_","O__"];
         CommonSRFont[8] = [
"OOO","_O_",  "OO_","_OO","OO_","OOO","OOO","_OO",
"OOO", "O_O",  "O_O","O__", "O_O","O__", "O__","O__",
"OOO","OOO", "OO_", "O__","O_O","OOO","OOO","O_O",
"OOO", "O_O",  "O_O", "O__", "O_O","O__","O__","O_O",
"OOO","O_O", "OO_", "_OO", "OO_","OOO","O__","_OO"];
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
"O_O", "O_O", "OOO", "___", "___", "___", "___", "___",
"O_O", "O_O", "__O", "___", "___", "___", "___", "___",
"_O_", "_O_", "_O_", "___", "___", "___", "___", "___",
"O_O", "_O_", "O__", "___", "___", "___", "___", "___",
 "O_O", "_O_", "OOO", "___", "___", "___", "___", "___"];
      CommonSRFont[12] = [
"OOO","_O_",  "OO_","_OO","OO_","OOO","OOO","_OO",
"OOO", "O_O",  "O_O","O__", "O_O","O__", "O__","O__",
"OOO","OOO", "OO_", "O__","O_O","OOO","OOO","O_O",
"OOO", "O_O",  "O_O", "O__", "O_O","O__","O__","O_O",
"OOO","O_O", "OO_", "_OO", "OO_","OOO","O__","_OO"];
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
"O_O", "O_O", "OOO", "___", "___", "___", "___", "___",
"O_O", "O_O", "__O", "___", "___", "___", "___", "___",
"_O_", "_O_", "_O_", "___", "___", "___", "___", "___",
"O_O", "_O_", "O__", "___", "___", "___", "___", "___",
 "O_O", "_O_", "OOO", "___", "___", "___", "___", "___"];

CommonStringRender.fontW = 4;
CommonStringRender.fontH = 5;

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