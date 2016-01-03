var frameCommon = require("ui/frame/frame-common");
var trace = require("trace");
var enums = require("ui/enums");
var utils = require("utils/utils");
var view = require("ui/core/view");
var types = require("utils/types");
require("utils/module-merge").merge(frameCommon, exports);
var ENTRY = "_entry";
var navDepth = 0;
var Frame = (function (_super) {
    __extends(Frame, _super);
    function Frame() {
        _super.call(this);
        this._shouldSkipNativePop = false;
        // TODO:
        this._dotnet = undefined; // new iOSFrame(this);
    }
    Frame.prototype.onLoaded = function () {
        _super.prototype.onLoaded.call(this);
        if (this._paramToNavigate) {
            this.navigate(this._paramToNavigate);
            this._paramToNavigate = undefined;
        }
    };
    Frame.prototype.navigate = function (param) {
        if (this.isLoaded) {
            _super.prototype.navigate.call(this, param);
        }
        else {
            this._paramToNavigate = param;
        }
    };
    Frame.prototype._navigateCore = function (backstackEntry) {
        navDepth++;
        // TODO:
    };
    Frame.prototype._goBackCore = function (entry) {
        navDepth--;
        // TODO:
    };
    Frame.prototype.updateNavigationBar = function (page) {

    };
    Object.defineProperty(Frame.prototype, "dotnet", {
        get: function () {
            return this._dotnet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame.prototype, "_nativeView", {
        get: function () {
            // TODO:
            return undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Frame, "defaultAnimatedNavigation", {
        get: function () {
            return frameCommon.Frame.defaultAnimatedNavigation;
        },
        set: function (value) {
            frameCommon.Frame.defaultAnimatedNavigation = value;
        },
        enumerable: true,
        configurable: true
    });
    Frame.prototype.requestLayout = function () {
        _super.prototype.requestLayout.call(this);
        var window = this._nativeView.window;
        if (window) {
            window.setNeedsLayout();
        }
    };
    Frame.prototype.onMeasure = function (widthMeasureSpec, heightMeasureSpec) {
        var width = utils.layout.getMeasureSpecSize(widthMeasureSpec);
        var widthMode = utils.layout.getMeasureSpecMode(widthMeasureSpec);
        var height = utils.layout.getMeasureSpecSize(heightMeasureSpec);
        var heightMode = utils.layout.getMeasureSpecMode(heightMeasureSpec);
        var result = view.View.measureChild(this, this.currentPage, widthMeasureSpec, utils.layout.makeMeasureSpec(height - this.navigationBarHeight, heightMode));
        if (this._navigateToEntry) {
            view.View.measureChild(this, this._navigateToEntry.resolvedPage, widthMeasureSpec, utils.layout.makeMeasureSpec(height - this.navigationBarHeight, heightMode));
        }
        var widthAndState = view.View.resolveSizeAndState(result.measuredWidth, width, widthMode, 0);
        var heightAndState = view.View.resolveSizeAndState(result.measuredHeight, height, heightMode, 0);
        this.setMeasuredDimension(widthAndState, heightAndState);
    };
    Frame.prototype.onLayout = function (left, top, right, bottom) {
        view.View.layoutChild(this, this.currentPage, 0, this.navigationBarHeight, right - left, bottom - top);
        if (this._navigateToEntry) {
            view.View.layoutChild(this, this._navigateToEntry.resolvedPage, 0, this.navigationBarHeight, right - left, bottom - top);
        }
    };
    Object.defineProperty(Frame.prototype, "navigationBarHeight", {
        get: function () {
            // TODO:
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    return Frame;
})(frameCommon.Frame);
exports.Frame = Frame;
