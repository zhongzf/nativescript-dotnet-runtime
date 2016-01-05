var timeoutCallbacks = {};
var timerId = 0;
function getId() {
    timerId++;
    return timerId;
}
function setTimeout(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    var id = getId();
    var timer = new System.Timers.Timer(milliseconds);
    timer.AutoReset = false;
    timer.add_Elapsed(function (sender, e) {
        callback();
        if (timeoutCallbacks[id]) {
            delete timeoutCallbacks[id];
        }
    });
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = timer;
    }
    timer.Start();
    return id;
}
exports.setTimeout = setTimeout;
function clearTimeout(id) {
    if (timeoutCallbacks[id]) {
        timeoutCallbacks[id].Stop();
        delete timeoutCallbacks[id];
    }
}
exports.clearTimeout = clearTimeout;
function setInterval(callback, milliseconds) {
    if (milliseconds === void 0) { milliseconds = 0; }
    var id = getId();
    var timer = new System.Timers.Timer(milliseconds);
    timer.AutoReset = false;
    timer.add_Elapsed(function (sender, e) {
        callback();
        timer.Start();
    });
    if (!timeoutCallbacks[id]) {
        timeoutCallbacks[id] = timer;
    }
    timer.Start();
    return id;
}
exports.setInterval = setInterval;
exports.clearInterval = clearTimeout;
