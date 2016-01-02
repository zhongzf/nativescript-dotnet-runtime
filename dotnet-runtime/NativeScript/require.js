/*
 * THIS JAVASCRIPT FILE IS EMBEDED BY THE BUILD PROCESS.
 *
 * You can ignore this file and continue debugging.
 */

(function (applicationPath, createModuleFunction) {
    'use strict';

    String.prototype.template = function (data) {
        return this.replace(/\${(.*?)}/g, function (_, code) {
            var scoped = code.replace(/(["'\.\w\$]+)/g, function (match) {
                return /["']/.test(match[0]) ? match : 'scope.' + match;
            });
            try {
                return new Function('scope', 'return ' + scoped)(data);
            } catch (e) { return ''; }
        });
    };

    String.prototype.stringByDeletingLastPathComponent = function () {
        return new System.IO.FileInfo(this).Directory.Name;
    };

    String.prototype.lastPathComponent = function () {
        return new System.IO.FileInfo(this).Name;
    };

    String.prototype.stringByAppendingPathExtension = function (value) {
        return this + "." + value;
    };

    String.prototype.stringByAppendingPathComponent = function (value) {
        return System.IO.Path.Combine(this, value);
    };

    
    var fileManager = {
        fix: function (path) {
            return System.String.IsNullOrEmpty(path)
                ? ""
                : System.IO.Path.DirectorySeparatorChar != '/'
                    ? path.replace(/(\/)/, System.IO.Path.DirectorySeparatorChar)
                    : path;
        },
        fileExistsAtPathIsDirectory: function (path, isDirectory) {
            var fullPath = this.fix(path);
            isDirectory.value = System.IO.Directory.Exists(fullPath);
            var result = isDirectory.value || System.IO.File.Exists(fullPath);
            console.debug("path: ", fullPath, ", isDirectory: ", isDirectory.value, ", result: ", result);
            return result;
        }
    };

    var console = {
        enbleDebug: false,

        log: function (value) {
            log(value);
        },
        debug: function (p1, p2, p3, p4, p5, p6) {
            if (this.enbleDebug) {
                var value = p1.toString();
                if (p2) value += p2.toString();
                if (p3) value += p3.toString();
                if (p4) value += p4.toString();
                if (p5) value += p5.toString();
                if (p6) value += p6.toString();
                this.log(value);
            }            
        }
    };

    var USER_MODULES_ROOT = 'app';
    var CORE_MODULES_ROOT = 'app/tns_modules';

    var isDirectory = { value: false };
    var defaultPreviousPath = System.IO.Path.Combine(USER_MODULES_ROOT, 'index.js');
    
    var pathCache = new Map();
    var modulesCache = new Map();

    function getRelativeToBundlePath(absolutePath) {
        var relativePath = absolutePath.substr(applicationPath.length).replace(/^\//, '');
        console.debug("relativePath: ", relativePath);
        return relativePath;
    }

    function getModuleCacheKey(moduleMetadata) {
        var key = moduleMetadata.bundlePath;
        key = fileManager.fix(key);
        console.debug("key: ", key);
        return key;
    }

    function __findModule(moduleIdentifier, previousPath) {
        console.debug("__findModule(moduleIdentifier: " + moduleIdentifier + ", previousPath: " + previousPath + ")");

        var isBootstrap = !previousPath;
        if (isBootstrap) {
            previousPath = defaultPreviousPath;
        }
        var absolutePath;
        if (/^\.{1,2}\//.test(moduleIdentifier)) { // moduleIdentifier starts with ./ or ../
            var moduleDir =  previousPath.stringByDeletingLastPathComponent();
            absolutePath = System.IO.Path.Combine(applicationPath, moduleDir, moduleIdentifier);
        } else if (/^\//.test(moduleIdentifier)) { // moduleIdentifier starts with /
            absolutePath = moduleIdentifier;
        } else if (/^~\//.test(moduleIdentifier)) {
            absolutePath = System.IO.Path.Combine(applicationPath, USER_MODULES_ROOT, moduleIdentifier.substr(2));
        } else {
            absolutePath = System.IO.Path.Combine(applicationPath, CORE_MODULES_ROOT, moduleIdentifier);
        }
        absolutePath = fileManager.fix(absolutePath);
        console.debug("absolutePath: ", absolutePath);

        var requestedPath = absolutePath;
        if (pathCache.has(requestedPath)) {
            return pathCache.get(requestedPath);
        }

        var moduleMetadata = {
            name: moduleIdentifier.lastPathComponent(),
        };

        var absoluteFilePath = absolutePath.stringByAppendingPathExtension("js");
        if (/\.json$/.test(absolutePath)) {
            moduleMetadata.type = 'json';
        } else {
            if (!fileManager.fileExistsAtPathIsDirectory(absoluteFilePath, isDirectory) &&
                fileManager.fileExistsAtPathIsDirectory(absolutePath, isDirectory)) {
                if (!isDirectory.value) {
                    throw new Error('Expected ${getRelativeToBundlePath(absolutePath)} to be a directory.'.template({ getRelativeToBundlePath: getRelativeToBundlePath, absolutePath: absolutePath }));
                }

                var mainFileName = 'index.js';

                var packageJsonPath = absolutePath.stringByAppendingPathComponent("package.json");
                console.debug("packageJsonPath: ", packageJsonPath);

                var packageJson = System.IO.File.ReadAllText(packageJsonPath);
                if (packageJson) {
                    console.debug("PACKAGE_FOUND: " + packageJsonPath);

                    var packageJsonMain;
                    try {
                        packageJsonMain = JSON.parse(packageJson).main;
                    } catch (e) {
                        throw new Error('Error parsing package.json in file:///${getRelativeToBundlePath(absolutePath)}/package.json - ${e}'.template({getRelativeToBundlePath:getRelativeToBundlePath, absolutePath: absolutePath}));
                    }

                    if (packageJsonMain && !/\.js$/.test(packageJsonMain)) {
                        packageJsonMain += '.js';
                    }
                    mainFileName = packageJsonMain || mainFileName;
                }

                absolutePath = absolutePath.stringByAppendingPathComponent(mainFileName);
            } else {
                absolutePath = absoluteFilePath;
            }

            moduleMetadata.type = 'js';
        }
        var bundlePath = getRelativeToBundlePath(absolutePath);

        if (!fileManager.fileExistsAtPathIsDirectory(absolutePath, isDirectory)) {
            throw new Error('Failed to find module ${moduleIdentifier} relative to file:///${previousPath}. Computed path: ${bundlePath}.'.template({moduleIdentifier: moduleIdentifier, previousPath: previousPath, bundlePath: bundlePath}));
        }

        if (isDirectory.value) {
            throw new Error('Expected ${bundlePath} to be a file'.template({bundlePath: bundlePath}));
        }

        console.debug('FIND_MODULE:', moduleIdentifier, absolutePath);

        moduleMetadata.path = absolutePath;
        moduleMetadata.bundlePath = bundlePath;

        pathCache.set(requestedPath, moduleMetadata);
        return moduleMetadata;
    }

    function __executeModule(moduleMetadata, module) {
        console.debug("__executeModule(moduleMetadata: " + moduleMetadata + ", module: " + module + ")");

        var modulePath = moduleMetadata.bundlePath;
        var moduleSource = System.IO.File.ReadAllText(moduleMetadata.path);

        var hadError = true;

        if (moduleMetadata.type === 'js') {
            module.require = function __require(moduleIdentifier) {
                return __loadModule(moduleIdentifier, modulePath).exports;
            };
            var dirName = moduleMetadata.path.stringByDeletingLastPathComponent;

            try {
                var moduleFunction = createModuleFunction(moduleSource, "file:///" + moduleMetadata.bundlePath);
                moduleFunction(module.require, module, module.exports, dirName, moduleMetadata.path);
                hadError = false;
            } finally {
                if (hadError) {
                    modulesCache.delete(getModuleCacheKey(moduleMetadata));
                }
            }
        } else if (moduleMetadata.type === 'json') {
            try {
                module.exports = JSON.parse(moduleSource);
                hadError = false;
            } catch (e) {
                e.message = 'File: file:///${moduleMetadata.bundlePath}. ${e.message}'.template({moduleMetadata:moduleMetadata, e:e});
                throw e;
            } finally {
                if (hadError) {
                    modulesCache.delete(getModuleCacheKey(moduleMetadata));
                }
            }
        } else {
            throw new Error('Unknown module type ${moduleMetadata.type}'.template({moduleMetadata:moduleMetadata}));
        }
    }

    function __loadModule(moduleIdentifier, previousPath) {
        console.debug("__loadModule(moduleIdentifier: " + moduleIdentifier + ", previousPath: " + previousPath + ")");

        if (/\.js$/.test(moduleIdentifier)) {
            moduleIdentifier = moduleIdentifier.replace(/\.js$/, '');
        }

        var moduleMetadata = __findModule(moduleIdentifier, previousPath);

        var key = getModuleCacheKey(moduleMetadata);
        if (modulesCache.has(key)) {
            return modulesCache.get(key);
        }

        var module = {
            exports: {},
            id: moduleMetadata.bundlePath,
            filename: moduleMetadata.path,
        };

        modulesCache.set(key, module);

        __executeModule(moduleMetadata, module);

        return module;
    }

    global.require = function (moduleIdentifier) {
        __loadModule(moduleIdentifier, defaultPreviousPath).exports;
    };

    return __loadModule;
});
