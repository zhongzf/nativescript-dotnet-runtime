var dependencyObservable = require("ui/core/dependency-observable");
log("button-common: 1");
watch(dependencyObservable);
var view = require("ui/core/view");
log("button-common: 2");
watch(view);
var proxy = require("ui/core/proxy");
log("button-common: 3");
watch(proxy);
var observable = require("data/observable");
log("button-common: 4");
watch(observable);
var weakEvents = require("ui/core/weak-event-listener");
log("button-common: 5");
watch(weakEvents);

var textProperty = new dependencyObservable.Property("text", "Button", new proxy.PropertyMetadata("", dependencyObservable.PropertyMetadataSettings.AffectsLayout));
function onTextPropertyChanged(data) {
    var button = data.object;
    button._onTextPropertyChanged(data);
}
textProperty.metadata.onSetNativeValue = onTextPropertyChanged;

var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        _super.apply(this, arguments);
    }
    Button.prototype._onBindingContextChanged = function (oldValue, newValue) {
        _super.prototype._onBindingContextChanged.call(this, oldValue, newValue);
        this.dotnet.Content = newValue;
    };
    Object.defineProperty(Button.prototype, "text", {
        get: function () {
            return this._getValue(Button.textProperty);
        },
        set: function (value) {
            this._setValue(Button.textProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Button.prototype._onTextPropertyChanged = function (data) {
        this.dotnet.Content = data.newValue + "";
    };
    Button.tapEvent = "tap";
    Button.textProperty = textProperty;
    return Button;
})(view.View);
exports.Button = Button;
