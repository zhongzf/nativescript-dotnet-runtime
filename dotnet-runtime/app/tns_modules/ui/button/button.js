var Perspex = importNamespace("Perspex");

var common = require("ui/button/button-common");
require("utils/module-merge").merge(common, exports);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = this;
        _super.call(this);
        this._dotnet = new Perspex.Controls.Button();
        this._dotnet.add_Click(function (sender, e) {
            _this._emit(common.Button.tapEvent);
        });
    }
    Object.defineProperty(Button.prototype, "dotnet", {
        get: function () {
            return this._dotnet;
        },
        enumerable: true,
        configurable: true
    });
    return Button;
})(common.Button);
exports.Button = Button;
