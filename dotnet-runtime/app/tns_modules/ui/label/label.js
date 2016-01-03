var Perspex = importNamespace("Perspex");

var common = require("ui/label/label-common");
function onTextWrapPropertyChanged(data) {
    var label = data.object;
    if (!label.dotnet) {
        return;
    }
    if (data.newValue) {
        label.dotnet.TextWrapping = Perspex.Controls.TextWrapping.Wrap;
    }
    else {
        label.dotnet.TextWrapping = Perspex.Controls.TextWrapping.NoWrap;
    }
}
common.Label.textWrapProperty.metadata.onSetNativeValue = onTextWrapPropertyChanged;
require("utils/module-merge").merge(common, exports);
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        _super.call(this, options);
        this._dotnet = new Perspex.Controls.TextBlock();
    }
    Object.defineProperty(Label.prototype, "dotnet", {
        get: function () {
            return this._dotnet;
        },
        enumerable: true,
        configurable: true
    });
    return Label;
})(common.Label);
exports.Label = Label;
