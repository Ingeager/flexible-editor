//FLEX_INCLUDE "common_default.js"

Coord = {}

Coord.hasX = false;
Coord.hasY = false;
Coord.pointerX = 0;
Coord.pointerY = 1;
Coord.bmW = 256*2,
Coord.bmH = 256*2;
Coord.fieldW = 256;
Coord.fieldH = 256;
Coord.lineColorV = 0x40DFFF;
Coord.lineColorH = 0xFFFF40;
Coord.bmView = {}
Coord.editY = {}
Coord.editX = {}

function init() {
	DefaultControls.init();
	
    var parentWnd = Core.window;
    Coord.bmView = new BitmapView(parentWnd);
    Coord.bmView.move(Core.base_x, Core.base_y);
    Coord.bmView.init(Coord.bmW, Coord.bmH);
    Coord.bmView.mousePress.connect(Coord, Coord.mouseFunc);
    Coord.bmView.show();

    if (Core.hasAttr("x")) {
        Coord.hasX = true;
    }
    if (Core.hasAttr("y")) {
        Coord.hasY = true;
    }

    if ((Coord.hasY == false) && (Coord.hasX == false)) {
        Coord.hasY = true;
        Coord.hasX = true;
        Coord.pointerY = 0;
        Coord.pointerX = 1;
    } else {
        var pointer = 0;
        if (Coord.hasY == true) {
           var ytxt = Core.getAttr("y");
           if (ytxt.length < 1) {
               Coord.pointerY = pointer;
               pointer++;
           } else {
               var yp = Core.getHexValueAttr("y");
               Coord.pointerY = yp;
           }
        }
        if (Coord.hasX == true) {
           var xtxt = Core.getAttr("x");
           if (xtxt.length < 1) {
               Coord.pointerX = pointer;
               pointer++;
           } else {
               var xp = Core.getHexValueAttr("x");
               Coord.pointerX = xp;
           }
        }
    }

    if (Coord.hasY == true) {
        Coord.editY = new QLineEdit(parentWnd);
        Coord.editY.move(Core.base_x+Coord.bmW+10, Core.base_y);
        Coord.editY.resize(50, 20);
        Coord.editY.readOnly = true;
        Coord.editY.show();
        Core.base_y += Coord.editY.height+8;
    }

  if (Coord.hasX == true) {
        Coord.editX = new QLineEdit(parentWnd);
        Coord.editX.move(Core.base_x+Coord.bmW+10, Core.base_y);
        Coord.editX.resize(50, 20);
        Coord.editX.readOnly = true;
        Coord.editX.show();
        Core.base_y += Coord.editX.height+8;
    }
    
    Coord.redraw();
}

Coord.mouseFunc = function(a_btn, a_y, a_x) {

    if (Coord.hasY == true) {
      var stepY = Coord.bmH / Coord.fieldH;
      var dotY = Math.floor(a_y / stepY);
      Core.setByte(Coord.pointerY, dotY);
    }

    if (Coord.hasX == true) {
      var stepX = Coord.bmW / Coord.fieldW;
      var dotX = Math.floor(a_x / stepX);
      Core.setByte(Coord.pointerX, dotX);
    }

    Coord.redraw();
}

Coord.redraw = function() {
    //Coord.bmView.fill(0);
    Coord.bmView.drawBox(0, Coord.bmH-1, 0, Coord.bmH-1, 1);

  if (Coord.hasX == true) {
        var stepX = Coord.bmW / Coord.fieldW;
        var dataX = Core.getByte(Coord.pointerX);
        var drawX = Math.floor(dataX * stepX);
        var drawX2 = Math.floor((dataX+1) * stepX)-1;
        Coord.bmView.drawBox(0, Coord.bmH-1, drawX, drawX2, Coord.lineColorH);

        Coord.editX.text = "X: " + dataX;
    }
    
    if (Coord.hasY == true) {
        var stepY = Coord.bmH / Coord.fieldH;
        var dataY = Core.getByte(Coord.pointerY);
        var drawY = Math.floor(dataY * stepY);
        var drawY2 = Math.floor((dataY+1) * stepY)-1;
        Coord.bmView.drawBox(drawY, drawY2, 0, Coord.bmW-1, Coord.lineColorV);

	Coord.editY.text = "Y: " + dataY;
    }

    Coord.bmView.refresh();

}
