//var Perspex = importNamespace("Perspex");

var common = require("color/color-common");
var Color = (function (_super) {
    __extends(Color, _super);
    function Color() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Color.prototype, "dotnet", {
        get: function () {
            return this.argb;
        },
        enumerable: true,
        configurable: true
    });
    Color.prototype._argbFromString = function (hex) {
        //return Perspex.Media.Color.Parse(hex);
    };
    return Color;
})(common.Color);
exports.Color = Color;
