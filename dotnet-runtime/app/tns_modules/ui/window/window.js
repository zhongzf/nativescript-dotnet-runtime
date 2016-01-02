var Perspex = importNamespace("Perspex");
var dependencyObservable = require("ui/core/dependency-observable");

var Window = (function (_super) {
    __extends(Window, _super);
    function Window() {
        _super.call(this);
        this.dotnet = new Perspex.Controls.Window();
    }
    Window.prototype.onLoaded = function () {
    };
    Window.prototype.load = function (filePath) {
        var file = System.IO.File.OpenRead(System.IO.Path.Combine("app", filePath));
        var xamlLoader = new Perspex.Markup.Xaml.PerspexXamlLoader();
        xamlLoader.Load(file, this.dotnet);
        this.onLoaded();
    };
    Window.prototype.find = function (type, name) {
        var control = Perspex.Controls.NameScopeExtensions.Find(type).Invoke(null, [this.dotnet, name]);
        return control;
    };
    Window.prototype.show = function () {
        this.dotnet.Show();
    };
    return Window;
})(dependencyObservable.DependencyObservable);
exports.Window = Window;
