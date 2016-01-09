//var Perspex = importNamespace("Perspex");
var OmniXaml = importNamespace("OmniXaml");
var dependencyObservable = require("ui/core/dependency-observable");

var Window = (function (_super) {
    __extends(Window, _super);
    function Window() {
        _super.call(this);
        this.dotnet = new System.Windows.Window();
    }
    Window.prototype.onLoaded = function () {
    };
    Window.prototype.load = function (filePath) {
        var file = System.IO.File.OpenRead(System.IO.Path.Combine("app", filePath));
        var xamlLoader = new OmniXaml.Wpf.WpfXamlLoader();
        xamlLoader.Load(file, this.dotnet);
        this.onLoaded();
    };
    Window.prototype.find = function (name) {
        var control = this.dotnet.FindName(name);
        return control;
    };
    Window.prototype.show = function () {
        this.dotnet.Show();
    };
    return Window;
})(dependencyObservable.DependencyObservable);
exports.Window = Window;
