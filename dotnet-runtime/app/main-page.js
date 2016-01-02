﻿var Perspex = importNamespace("Perspex");

var windowModule = require("ui/window");
var dependencyObservable = require("ui/core/dependency-observable");

var MainPage = (function (_super) {
    __extends(MainPage, _super);
    function MainPage() {
        _super.call(this);
    }
    MainPage.prototype.onLoaded = function () {
        var button = this.find(Perspex.Controls.Button, "button");
        var that = this;
        button.add_Click(function (sender, e) {
            var textbox = that.find(Perspex.Controls.TextBlock, "textbox");
            textbox.Text += "\nbutton clicked.";
        });
    };
    return MainPage;
})(windowModule.Window);
exports.MainPage = MainPage;