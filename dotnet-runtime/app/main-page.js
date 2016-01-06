var Perspex = importNamespace("Perspex");

var windowModule = require("ui/window");
var dependencyObservable = require("ui/core/dependency-observable");

var timer = require("timer");

var MainPage = (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        _super.call(this);
        this.counter = 0;
    }
    MainPage.prototype.onLoaded = function () {
        var that = this;
        var button = this.find(Perspex.Controls.Button, "button");
        var textboxA = that.find(Perspex.Controls.TextBlock, "textbox");
        button.add_Click(function (sender, e) {
            var textbox = that.find(Perspex.Controls.TextBlock, "textbox");
            textbox.Text += "\nbutton clicked.";

            //var buttonModule = require("ui/button");
            //var btn = new buttonModule.Button();
            //btn.text = "new button with text";
            //btn.on(buttonModule.Button.tapEvent, function (e) {
            //    btn.text = "new button clicked.";
            //});
            //button.Parent.Children.Add(btn.dotnet);

            //var textFieldModule = require("ui/text-field");
            //var tf = new textFieldModule.TextField();
            //tf.text = "test text field.";
            //button.Parent.Children.Add(tf.dotnet);

            //var textViewModule = require("ui/text-view");
            //var tw = new textViewModule.TextView();
            //tw.text = "test text view."
            //button.Parent.Children.Add(tw.dotnet);

            //var labelViewModule = require("ui/label");
            //var lb = new labelViewModule.Label();
            //lb.text = "test label..."
            //button.Parent.Children.Add(lb.dotnet);

        });

        //var fs = require("file-system");
        //var fe = fs.File.exists("app/app.js");
        //log("fe: " + fe);
        //var de = fs.Folder.exists("app/tns_modules");
        //log("de: " + de);

        //var pageModule = require("ui/page");
        //watch(pageModule);
        //var page = new pageModule.Page();
        //watch(page);

        //var frameModule = require("ui/frame");
        //watch(frameModule);

        //var frame = new frameModule.Frame();
        //watch(frame);

        //watch(timer);
        var consoleModule = require("console");
        var console = new consoleModule.Console();
        timer.setInterval(function (e) {
            that.counter++;
            watch(that.counter);
            console.info(that.counter);

            textbox.Text += "\nbutton clicked." + that.counter;

        }, 1000);
    };
    return MainPage;
})(windowModule.Window);
exports.MainPage = MainPage;
