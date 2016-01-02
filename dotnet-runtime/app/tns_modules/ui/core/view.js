log("view: 1");
//var viewCommon = require("ui/core/view-common");
log("view: 2");
//watch(viewCommon);
//var trace = require("trace");
//require("utils/module-merge").merge(viewCommon, exports);
var dependencyObservable = require("ui/core/dependency-observable");


var PFLAG_FORCE_LAYOUT = 1;
var PFLAG_MEASURED_DIMENSION_SET = 1 << 1;
var PFLAG_LAYOUT_REQUIRED = 1 << 2;

var View = (function (_super) {
    __extends(View, _super);
    function View() {
        _super.call(this);
        this._privateFlags = PFLAG_LAYOUT_REQUIRED | PFLAG_FORCE_LAYOUT;
    }
    View.prototype.onLoaded = function () {
    };
    return View;
})(dependencyObservable.DependencyObservable/*viewCommon.View*/);
exports.View = View;

var CustomLayoutView = (function (_super) {
    __extends(CustomLayoutView, _super);
    function CustomLayoutView() {
        _super.call(this);
    }
    return CustomLayoutView;
})(View);
exports.CustomLayoutView = CustomLayoutView;
