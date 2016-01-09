var spanCommon = require("text/span-common");
var enums = require("ui/enums");
var utils = require("utils/utils");
require("utils/module-merge").merge(spanCommon, exports);
var Span = (function (_super) {
    __extends(Span, _super);
    function Span() {
        _super.apply(this, arguments);
    }
    Span.prototype.updateSpanModifiers = function (parent) {
        _super.prototype.updateSpanModifiers.call(this, parent);
        // TODO:
    };
    return Span;
})(spanCommon.Span);
exports.Span = Span;
