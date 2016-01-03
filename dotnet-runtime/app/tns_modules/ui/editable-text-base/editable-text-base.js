var common = require("ui/editable-text-base/editable-text-base-common");
var enums = require("ui/enums");
var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase(options) {
        _super.call(this, options);
    }
    EditableTextBase.prototype.dismissSoftInput = function () {
    };
    EditableTextBase.prototype._onKeyboardTypePropertyChanged = function (data) {
        var newKeyboardType;
        switch (data.newValue) {
            case enums.KeyboardType.datetime:
            case enums.KeyboardType.phone:
            case enums.KeyboardType.number:
            case enums.KeyboardType.url:
            case enums.KeyboardType.email:
            default:
        }
        // TODO: keyboardType        
    };
    EditableTextBase.prototype._onReturnKeyTypePropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case enums.ReturnKeyType.done:
            case enums.ReturnKeyType.go:
            case enums.ReturnKeyType.next:
            case enums.ReturnKeyType.search:
            case enums.ReturnKeyType.send:
            default:
        }
        // TODO: returnKeyType        
    };
    EditableTextBase.prototype._onAutocapitalizationTypePropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case enums.AutocapitalizationType.none:
            case enums.AutocapitalizationType.words:
            case enums.AutocapitalizationType.sentences:
            case enums.AutocapitalizationType.allCharacters:
            default:
        }
        // TODO: autocapitalizationType
    };
    EditableTextBase.prototype._onAutocorrectPropertyChanged = function (data) {
        var newValue;
        switch (data.newValue) {
            case true:
            case false:
            default:
        }
        // TODO: autocorrectionType
    };
    return EditableTextBase;
})(common.EditableTextBase);
exports.EditableTextBase = EditableTextBase;
