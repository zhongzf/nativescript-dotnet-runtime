var enums = require("ui/enums");
var application = require("application");
var platformNames;
(function (platformNames) {
    platformNames.android = "Android";
    platformNames.ios = "iOS";
    platformNames.dotnet = ".NET";
})(platformNames = exports.platformNames || (exports.platformNames = {}));
var device = (function () {
    function device() {
    }
    Object.defineProperty(device, "os", {
        get: function () {
            return platformNames.dotnet;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "manufacturer", {
        get: function () {
            if (!device._manufacturer) {
                device._manufacturer = ".NET";
            }
            return device._manufacturer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "osVersion", {
        get: function () {
            if (!device._osVersion) {
                device._osVersion = "4.5";
            }
            return device._osVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "model", {
        get: function () {
            if (!device._model) {
                device._model = "Desktop";
            }
            return device._model;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "sdkVersion", {
        get: function () {
            if (!device._sdkVersion) {
                device._sdkVersion = "4.5";
            }
            return device._sdkVersion;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "deviceType", {
        get: function () {
            if (!device._deviceType) {
                var dips = Math.min(screen.mainScreen.widthPixels, screen.mainScreen.heightPixels) / screen.mainScreen.scale;
                if (dips >= device.MIN_TABLET_PIXELS) {
                    device._deviceType = enums.DeviceType.Tablet;
                }
                else {
                    device._deviceType = enums.DeviceType.Phone;
                }
            }
            return device._deviceType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "uuid", {
        get: function () {
            if (!device._uuid) {
                device._uuid = "1234567890"
            }
            return device._uuid;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(device, "language", {
        get: function () {
            if (!device._language) {
                device._language = "en-us";
            }
            return device._language;
        },
        enumerable: true,
        configurable: true
    });
    device.MIN_TABLET_PIXELS = 600;
    return device;
})();
exports.device = device;
var mainScreenInfo;
var screen = (function () {
    function screen() {
    }
    Object.defineProperty(screen, "mainScreen", {
        get: function () {
            if (!mainScreenInfo) {
                var metrics = { widthPixels: 1024, heightPixels: 768, density: 200 };//application.android.context.getResources().getDisplayMetrics();
                mainScreenInfo = {
                    widthPixels: metrics.widthPixels,
                    heightPixels: metrics.heightPixels,
                    scale: metrics.density,
                    widthDIPs: metrics.widthPixels / metrics.density,
                    heightDIPs: metrics.heightPixels / metrics.density
                };
            }
            return mainScreenInfo;
        },
        enumerable: true,
        configurable: true
    });
    return screen;
})();
exports.screen = screen;
