var common = require("utils/utils-common");
require("utils/module-merge").merge(common, exports);

var layout;
(function (layout) {
    var MODE_SHIFT = 30;
    var MODE_MASK = 0x3 << MODE_SHIFT;
    function makeMeasureSpec(size, mode) {
        return (Math.round(size) & ~MODE_MASK) | (mode & MODE_MASK);
    }
    layout.makeMeasureSpec = makeMeasureSpec;
    function getDisplayDensity() {
        return 1;
    }
    layout.getDisplayDensity = getDisplayDensity;
})(layout = exports.layout || (exports.layout = {}));

function GC() {
    System.GC.Collect();
}
exports.GC = GC;
