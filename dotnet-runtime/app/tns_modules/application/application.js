var RaisingStudio = importNamespace("RaisingStudio");

var windowModule = require("ui/window");
var dependencyObservable = require("ui/core/dependency-observable");

exports.resources = undefined;

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

var application = new Application();
exports.dotnet = application;

exports.start = function () {
    var mainPageModule = require("../app/" + exports.mainModule + ".js");
    var window = new mainPageModule.MainPage();
    window.load(exports.mainModule + ".paml");
    window.show();
    application.run(window);
};
