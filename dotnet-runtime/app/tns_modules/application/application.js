var RaisingStudio = importNamespace("RaisingStudio");

var windowModule = require("ui/window");
var dependencyObservable = require("ui/core/dependency-observable");

var Application = (function (_super) {
    __extends(Application, _super);
    function Application() {
        _super.call(this);
        this.dotnet = new RaisingStudio.NativeScript.Application();
    }
    Application.prototype.run = function (window) {
        this.dotnet.Run(window.dotnet);
    };
    return Application;
})(dependencyObservable.DependencyObservable);

exports.start = function () {
    var application = new Application();
    var mainPageModule = require("../app/" + exports.mainModule + ".js");
    var window = new mainPageModule.MainPage();
    window.load(exports.mainModule + ".paml");
    window.show();
    application.run(window);
};
