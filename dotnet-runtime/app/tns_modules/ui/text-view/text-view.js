var Perspex = importNamespace("Perspex");

var common = require("ui/text-view/text-view-common");
require("utils/module-merge").merge(common, exports);

var TextView = (function (_super) {
    __extends(TextView, _super);
    function TextView() {
        _super.call(this);
        this._dotnet = new Perspex.Controls.TextBlock();
        // TODO: event
    }
    TextView.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        // TODO: event
    };
    TextView.prototype.onUnloaded = function () {
        // TODO: event
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TextView.prototype, "dotnet", {
        get: function () {
            return this._dotnet;
        },
        enumerable: true,
        configurable: true
    });
    TextView.prototype._onEditablePropertyChanged = function (data) {        
    };
    TextView.prototype._onHintPropertyChanged = function (data) {
    };
    TextView.prototype._onTextPropertyChanged = function (data) {
        _super.prototype._onTextPropertyChanged.call(this, data);
    };
    return TextView;
})(common.TextView);
exports.TextView = TextView;
