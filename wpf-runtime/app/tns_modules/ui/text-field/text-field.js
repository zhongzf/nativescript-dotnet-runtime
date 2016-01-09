//var Perspex = importNamespace("Perspex");

var common = require("ui/text-field/text-field-common");
var textBase = require("ui/text-base");
var enums = require("ui/enums");
require("utils/module-merge").merge(common, exports);

var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.call(this);
        //this._dotnet = new Perspex.Controls.TextBox();
        // TODO: event
    }
    TextField.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        // TODO: event
    };
    TextField.prototype.onUnloaded = function () {
        // TODO: event
        _super.prototype.onUnloaded.call(this);
    };
    Object.defineProperty(TextField.prototype, "dotnet", {
        get: function () {
            return this._dotnet;
        },
        enumerable: true,
        configurable: true
    });
    TextField.prototype._onHintPropertyChanged = function (data) {
        var textField = data.object;
        textField.dotnet.Watermark = data.newValue;
    };
    return TextField;
})(common.TextField);
exports.TextField = TextField;
