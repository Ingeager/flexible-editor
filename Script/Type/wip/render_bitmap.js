
Bitmap.bmfile = [];

init_render = function(a_bitmapView, a_y1, a_x1, a_y2, a_x2, a_paletteIndexes, a_palette) {
	
	if (a_bitmapView == 0) {
			a_bitmapView = new BitmapView(Core.window);
			a_bitmapView.move(a_x1, a_y1);
	}
	
	if (Core.versionDate >= 270101) {
		var file = Core.getAttr("file");
		Bitmap.bmfile = Core.loadBinaryFile(file);
		
	}
}