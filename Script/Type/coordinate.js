//FLEX_INCLUDE "common_default.js"

Coord = {}

Coord.hasX = false;
Coord.hasY = false;
Coord.pointerX = 0;
Coord.pointerY = 1;
Coord.snapX = 1;
Coord.snapY = 1;
Coord.gridX = 0;
Coord.gridY = 0;
Coord.bmW = 256*2;
Coord.bmH = 256*2;
Coord.fieldW = 256;
Coord.fieldH = 256;
Coord.bgColor = 0;
Coord.gridColor = 0;
Coord.lineColorV = 0xC0C0C0;
Coord.lineColorH = 0x606060;
Coord.bmView = {}
Coord.editY = {}
Coord.editX = {}

function init() {
	DefaultControls.init();

	Coord.lineColorV = Number("0x" + Core.customize("color1", "C0C0C0"));
	Coord.lineColorH = Number("0x" + Core.customize("color2", "606060"));
	Coord.bgColor = Number("0x" + Core.customize("bgcolor", "0"));

    var halfcolor = 0;
    var srccolor = Coord.lineColorV;
    halfcolor |= Math.round((srccolor & 0xFF) * 0.3);
    halfcolor |= (Math.round((srccolor & 0xFF00) * 0.3) & 0xFF00);
    halfcolor |= (Math.round((srccolor & 0xFF0000) * 0.3) & 0xFF0000);
	 Coord.gridColor = halfcolor;

    var parentWnd = Core.window;
    Coord.bmView = new BitmapView(parentWnd);
    Coord.bmView.move(Core.base_x, Core.base_y);
    Coord.bmView.init(Coord.bmW, Coord.bmH);
    Coord.bmView.mousePress.connect(Coord, Coord.mouseFunc);
    if (Core.versionDate >= 260109) {
	Coord.bmView.mouseMove.connect(Coord, Coord.mouseFunc);    
    }
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
	Coord.editY.styleSheet = Core.customize("edit.stylesheet", "");
        Coord.editY.show();
        Core.base_y += Coord.editY.height+8;
    }

  if (Coord.hasX == true) {
        Coord.editX = new QLineEdit(parentWnd);
        Coord.editX.move(Core.base_x+Coord.bmW+10, Core.base_y);
        Coord.editX.resize(50, 20);
        Coord.editX.readOnly = true;
	Coord.editX.styleSheet = Core.customize("edit.stylesheet", "");
        Coord.editX.show();
        Core.base_y += Coord.editX.height+8;
    }
    
    if (Core.hasAttr("snapx") == true) {
        Coord.snapX = Number(Core.getAttr("snapx"));
    }
    if (Core.hasAttr("snapy") == true) {
        Coord.snapY = Number(Core.getAttr("snapy"));
    }
    if (Core.hasAttr("gridx") == true) {
        Coord.gridX = Number(Core.getAttr("gridx"));
    }
    if (Core.hasAttr("gridy") == true) {
        Coord.gridY = Number(Core.getAttr("gridy"));
    }
    
    Coord.redraw();
}

Coord.mouseFunc = function(a_btn, a_y, a_x) {

	if (a_btn == 0) {return;}

    if (Coord.hasY == true) {
      var stepY = Coord.bmH / Coord.fieldH;
      var dotY = Math.floor(a_y / stepY);
      dotY = Math.round(dotY / Coord.snapY)*Coord.snapY;
      if (dotY < 0) {dotY = 0;}
      if (dotY >= Coord.fieldH) {dotY = Coord.fieldH-1;}
      Core.setByte(Coord.pointerY, dotY);
    }

    if (Coord.hasX == true) {
      var stepX = Coord.bmW / Coord.fieldW;
      var dotX = Math.floor(a_x / stepX);
      dotX = Math.round(dotX / Coord.snapX)*Coord.snapX;
      if (dotX < 0) {dotX = 0;}
      if (dotX >= Coord.fieldW) {dotX = Coord.fieldW-1;}
      Core.setByte(Coord.pointerX, dotX);
    }

    Coord.redraw();
}

Coord.redraw = function() {
    //Coord.bmView.fill(0);
/*    for (var y = 0; y < Coord.bmH; y++) {
	var c = Math.floor((y / Coord.bmH)*255);
	Coord.bmView.drawLineX(y, 0, Coord.bmW-1, c);
    }*/
    
	
	Coord.bmView.drawBox(0, Coord.bmH-1, 0, Coord.bmW-1, Coord.bgColor);

   /*
   if (Core.versionDate >= 999999) {
       // Draw any Render Elements here
       Core.renderRefresh(Coord.bmView, 0, 0);
   }
   */

if (Coord.gridX > 0) {
        var x = 0;
        while (x < Coord.fieldW) {
           var stepX = Coord.bmW / Coord.fieldW;
           var drawX = Math.floor(x * stepX);
           var drawX2 = Math.floor((x+1) * stepX)-1;
           Coord.bmView.drawBox(0, Coord.bmH-1, drawX, drawX2, Coord.gridColor);
           x += Coord.gridX;
        }
    }

   if (Coord.gridY > 0) {
        var y = 0;
        while (y < Coord.fieldH) {
	    var stepY = Coord.bmH / Coord.fieldH;
            var drawY = Math.floor(y * stepY);
            var drawY2 = Math.floor((y+1) * stepY)-1;
            Coord.bmView.drawBox(drawY, drawY2, 0, Coord.bmW-1, Coord.gridColor);
            y += Coord.gridY;
        }
    }

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
