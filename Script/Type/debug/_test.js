//FLEX_INCLUDE "common_default.js"

function init() {
	DefaultControls.init();

/*	aaa = new BitmapView(Core.window);
	aaa.move(Core.base_x, Core.base_y);
	aaa.show();
	
	var data = {};
	
	var handle = Core.initRender(0, aaa, data);
	
	Core.updateRender(handle, aaa, data);*/
	/*var llla = Core.childElementIndex("lala");
	print("singular:" + llla);
	lll = Core.childElementIndexList("laLA");
	print("multi:" + lll);
	print("multi len:" + lll.length);
	
	print("tag:" + Core.getElementTag(llla));*/
	
	var v = Core.childElementIndexList("", 1);
	print(v);
	//var v2 = Core.getAttr("name", v);
	//print(v2);

/*	var length = 64;
	var testarra = new Array(length);
	for (var a = 0; a < length; a++) {
		testarra[a] = a;
	}
	
	Core.setByteArray(0x380, testarra, length);*/
}