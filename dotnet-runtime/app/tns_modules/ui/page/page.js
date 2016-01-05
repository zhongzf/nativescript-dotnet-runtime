var pageCommon = require("ui/page/page-common");
var trace = require("trace");
var color = require("color");
require("utils/module-merge").merge(pageCommon, exports);

var Page = (function (_super) {
    __extends(Page, _super);
    function Page(options) {
        // why "System.StackOverflowException"?
        //_super.call(this, options);

        //this._isBackNavigation = false;
    }
    Page.prototype._onDetached = function (force) {
        //var skipDetached = !force && this.frame.android.cachePagesOnNavigate && !this._isBackNavigation;
        //if (skipDetached) {
        //    trace.write("Caching Page " + this._domId, trace.categories.NativeLifecycle);
        //}
        //else {
        //    _super.prototype._onDetached.call(this);
        //}
    };
    Page.prototype.onNavigatedFrom = function (isBackNavigation) {
        this._isBackNavigation = isBackNavigation;
        _super.prototype.onNavigatedFrom.call(this, isBackNavigation);
    };
    Page.prototype._showNativeModalView = function (parent, context, closeCallback, fullscreen) {
        if (!this.backgroundColor) {
            this.backgroundColor = new color.Color("White");
        }
        this._onAttached(parent._context);
        this._isAddedToNativeVisualTree = true;
        this.onLoaded();
        // TODO:
        //this._dialogFragment = new DialogFragmentClass(this, fullscreen);
        //this._dialogFragment.show(parent.frame.android.activity.getFragmentManager(), "dialog");
        _super.prototype._raiseShownModallyEvent.call(this, parent, context, closeCallback);
    };
    Page.prototype._hideNativeModalView = function (parent) {
        // TODO:
        //this._dialogFragment.dismissAllowingStateLoss();
        //this._dialogFragment = null;
        this.onUnloaded();
        this._isAddedToNativeVisualTree = false;
        this._onDetached(true);
    };
    Page.prototype._updateActionBar = function (hidden) {
        // TODO: 
        //this.actionBar.update();
    };
    return Page;
})(pageCommon.Page);
exports.Page = Page;
