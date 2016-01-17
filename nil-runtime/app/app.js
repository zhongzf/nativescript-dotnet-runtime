//var application = require("application");
//application.mainModule = "main-page";
//application.cssFile = "./app.css";
//application.start();

var application = new SystemWindows.Application();
var window = new SystemWindows.Window();
System.Console.WriteLine(window);
var map = new Map();
map.set("a", "b");
System.Console.WriteLine(map);
application.Run(window);