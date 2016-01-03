var common = require("ui/editable-text-base/editable-text-base-common");
var enums = require("ui/enums");
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase(options) {
        _super.call(this, options);
    }
    EditableTextBase.prototype.dismissSoftInput = function () {
    };

    return EditableTextBase;
})(common.EditableTextBase);
exports.EditableTextBase = EditableTextBase;
