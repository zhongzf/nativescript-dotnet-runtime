var types = require("utils/types");
var proxy = require("ui/core/proxy");
watch(proxy);
var trace = require("trace");
watch(proxy);
var dependencyObservable = require("ui/core/dependency-observable");
var bindable = require("ui/core/bindable");
log("view-common: 1");
watch(bindable);
var enums = require("ui/enums");
watch(enums);
log("view-common: 2");

function getViewById(view, id) {
}
exports.getViewById = getViewById;

var View = (function (_super) {
    __extends(View, _super);
    function View(options) {
        _super.call(this);
        this._isVisibleCache = true;
        this._measuredWidth = Number.NaN;
        this._measuredHeight = Number.NaN;
        this._oldWidthMeasureSpec = Number.NaN;
        this._oldHeightMeasureSpec = Number.NaN;
        this._oldLeft = 0;
        this._oldTop = 0;
        this._oldRight = 0;
        this._oldBottom = 0;
        this._isLayoutValid = false;
        this._isAddedToNativeVisualTree = false;
        this._cssClasses = [];
        this._options = options;
    }

    View.prototype.getViewById = function (id) {
        return getViewById(this, id);
    };
    return View;
})(proxy.ProxyObject);
exports.View = View;
