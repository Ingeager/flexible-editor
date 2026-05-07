//FetchAny.js: Fetch and display data from arbitrary Element, if its data type supports Fetch function.

//FLEX_INCLUDE "COMMON_DEFAULT.js"

function init() {
	DefaultControls.init();
	
	Box = new QPlainTextEdit(Core.window);
	Box.move(Core.base_x, Core.base_y);
	
	ElementIx = Number(Core.getAttr("element_index"));
	var data = Core.fetchElementData(ElementIx);
	
	var outputString = "(" + data.length + " entries): ";
	if (data.length > 0) {
		for (var ix = 0; ix < data.length; ix++) {
			var element = data[ix];
			outputString += element + ";";
		}
	}
	
	Box.setPlainText(outputString);
	Box.show();
	
}