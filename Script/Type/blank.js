//FLEX_INCLUDE "common_default.js"

function init() {
	DefaultControls.init();

	if (Core.hasAttr("len") == true) {
		DefaultControls.addArrayTuner();

		if (Core.versionDate >= 250823) {
			if (Core.hasAttr("arr_indexwidth") == true) {
				var indexSize = Core.getHexValueAttr("arr_indexwidth");
				Core.setArrayByteSize(indexSize);
			}
		}
	}
}