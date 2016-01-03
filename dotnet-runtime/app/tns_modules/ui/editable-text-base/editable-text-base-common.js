var textBase = require("ui/text-base");
var proxy = require("ui/core/proxy");
var dependencyObservable = require("ui/core/dependency-observable");
var enums = require("ui/enums");

//var editableProperty = new dependencyObservable.Property("editable", "EditableTextBase", new proxy.PropertyMetadata(true, dependencyObservable.PropertyMetadataSettings.None));
//function onEditablePropertyChanged(data) {
//    var editableTextBase = data.object;
//    editableTextBase._onEditablePropertyChanged(data);
//}
//editableProperty.metadata.onSetNativeValue = onEditablePropertyChanged;

var EditableTextBase = (function (_super) {
    __extends(EditableTextBase, _super);
    function EditableTextBase(options) {
        _super.call(this, options);
    }
    //Object.defineProperty(EditableTextBase.prototype, "editable", {
    //    get: function () {
    //        return this._getValue(EditableTextBase.editableProperty);
    //    },
    //    set: function (value) {
    //        this._setValue(EditableTextBase.editableProperty, value);
    //    },
    //    enumerable: true,
    //    configurable: true
    //});

    EditableTextBase.prototype.dismissSoftInput = function () {
    };

    EditableTextBase.prototype._onEditablePropertyChanged = function (data) {
    };
    //EditableTextBase.editableProperty = editableProperty;

    return EditableTextBase;
})(textBase.TextBase);
exports.EditableTextBase = EditableTextBase;
