//FetchAny.js: Fetch and display data from arbitrary Element, if its data type supports Fetch function.

//FLEX_INCLUDE "COMMON_DEFAULT.js"

Box = {};
List = {};
Spin = {};
Label = {};
ElementIx = 0;

function init() {
	DefaultControls.init();
	
	ElementIx = Number(Core.getAttr("element_index"));

   if (Core.versionDate >= 260530) {
     List = new QComboBox(Core.window);
       var count = Core.getElementCount();
       for (var ix = 0; ix < count; ix++) {
           var name = "";
	   if (Core.versionDate >= 260701) {
		name += "<" + Core.getElementTag(ix) + "> ";
	   }
	   name += "\"" + Core.getAttr("name", ix) + "\"";
           var str = ix.toString(10) + ": " + name;
           List.addItem(str);
       }
       List.setCurrentIndex(ElementIx);
       List.move(Core.base_x, Core.base_y);
       List.resize(300, 20);
	List.setStyleSheet(Core.customize("edit.stylesheet", "") + "");
       List['activated(int)'].connect(changeListFunc);
       List.editable = false;
       List.show();

       Core.base_y += (List.height + 10);
       Mode = 1;
   }  else {
       Spin = new QSpinBox(Core.window);
       Spin.minimum = 0;
       Spin.maximum = 32767;
       Spin.value = ElementIx;
       Spin['valueChanged(int)'].connect(changeUpDownFunc);
	    Spin.move(Core.base_x, Core.base_y);
	
	Label = new QLabel(Core.window);
	Label.move(Core.base_x+Spin.width, Core.base_y);
	Label.resize(300, 20);
	Label.show();
	
	Core.base_y += Spin.height;
   Mode = 0;
   }
   
	Box = new QPlainTextEdit(Core.window);
	Box.move(Core.base_x, Core.base_y);
	Box.setStyleSheet(Core.customize("edit.stylesheet", "") + "");
	Box.show();

   updateNewIndex();
}

function updateNewIndex() {
	var daataa = Core.fetchElementData(ElementIx);
	
	var outputString = "(" + daataa.length + " entries): ";
	if (daataa.length > 0) {
		for (var ix = 0; ix < daataa.length; ix++) {
			var element = daataa[ix];
			outputString += element + ";";
		}
	}
	
	Box.setPlainText(outputString);
	
}

function changeUpDownFunc(a_value) {
    ElementIx = a_value;
    updateNewIndex();
}

function changeListFunc(a_value) {
    ElementIx = a_value;
    updateNewIndex();
}