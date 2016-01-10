var textModule = require("text");
var types = require("utils/types");
var FileSystemAccess = (function () {
    function FileSystemAccess() {
        this._pathSeparator = System.IO.Path.PathSeparator;
    }
    FileSystemAccess.prototype.getLastModified = function (path) {
        var file = new System.IO.FileInfo(path);
        return file.LastWriteTime;
    };
    FileSystemAccess.prototype.getParent = function (path, onError) {
        try {
            var file = new System.IO.FileInfo(path);
            var parent = file.Directory;
            return { path: parent.FullName, name: parent.Name };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    };
    FileSystemAccess.prototype.getFile = function (path, onError) {
        return this.ensureFile(new System.IO.FileInfo(path), false, onError);
    };
    FileSystemAccess.prototype.getFolder = function (path, onError) {
        var directory = new System.IO.DirectoryInfo(path);
        var dirInfo = this.ensureFile(directory, true, onError);
        if (!dirInfo) {
            return undefined;
        }
        return { path: dirInfo.path, name: dirInfo.name };
    };
    FileSystemAccess.prototype.eachEntity = function (path, onEntity, onError) {
        if (!onEntity) {
            return;
        }
        this.enumEntities(path, onEntity, onError);
    };
    FileSystemAccess.prototype.getEntities = function (path, onSuccess, onError) {
        if (!onSuccess) {
            return;
        }
        var fileInfos = new Array();
        var onEntity = function (entity) {
            fileInfos.push(entity);
            return true;
        };
        var errorOccurred;
        var localError = function (error) {
            if (onError) {
                onError(error);
            }
            errorOccurred = true;
        };
        this.enumEntities(path, onEntity, localError);
        if (!errorOccurred) {
            onSuccess(fileInfos);
        }
    };
    FileSystemAccess.prototype.fileExists = function (path) {
        return System.IO.File.Exists(path);
    };
    FileSystemAccess.prototype.folderExists = function (path) {
        return System.IO.Directory.Exists(path);
    };
    FileSystemAccess.prototype.deleteFile = function (path, onSuccess, onError) {
        try {
            var file = new System.IO.FileInfo(path);
            if (!file.Exists) {
                if (onError) {
                    onError({ message: "The specified parameter is not a File entity." });
                }
                return;
            }
            file.Delete();
            if (onSuccess) {
                onSuccess();
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess.prototype.deleteFolder = function (path, isKnown, onSuccess, onError) {
        try {
            var directory = new System.IO.DirectoryInfo(path);
            if (!directory.Exists) {
                if (onError) {
                    onError({ message: "The specified parameter is not a Folder entity." });
                }
                return;
            }
            if (isKnown) {
                if (onError) {
                    onError({ message: "Cannot delete known folder." });
                }
                return;
            }

            System.IO.Directory.Delete(directory.FullName, true);

            if (onSuccess) {
                onSuccess();
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess.prototype.emptyFolder = function (path, onSuccess, onError) {
        try {
            var directory = new System.IO.DirectoryInfo(path);
            if (!directory.Exists) {
                if (onError) {
                    onError({ message: "The specified parameter is not a Folder entity." });
                }
                return;
            }
            this.deleteFolderContent(directory.FullName);
            if (onSuccess) {
                onSuccess();
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess.prototype.rename = function (path, newPath, onSuccess, onError) {
        var file = new System.IO.FileInfo(path);
        if (!file.Exists) {
            if (onError) {
                onError(new Error("The file to rename does not exist"));
            }
            return;
        }
        var newFile = new System.IO.FileInfo(newPath);
        if (newFile.Exists) {
            if (onError) {
                onError(new Error("A file with the same name already exists."));
            }
            return;
        }
        System.IO.File.Move(path, newPath);
        if (onSuccess) {
            onSuccess();
        }
    };
    FileSystemAccess.prototype.getDocumentsFolderPath = function () {
        return System.AppDomain.CurrentDomain.BaseDirectory;
    };
    FileSystemAccess.prototype.getTempFolderPath = function () {
        return System.IO.Path.GetTempPath();
    };
    FileSystemAccess.prototype.readText = function (path, onSuccess, onError, encoding) {
        try {
            var result = "";
            result = System.IO.File.ReadAllText(path, encoding);
            if (onSuccess) {
                onSuccess(result);
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess._removeUtf8Bom = function (s) {
        if (s.charCodeAt(0) === 0xFEFF) {
            s = s.slice(1);
        }
        return s;
    };
    FileSystemAccess.prototype.writeText = function (path, content, onSuccess, onError, encoding) {
        try {
            System.IO.File.WriteAllText(path, content, encoding);
            if (onSuccess) {
                onSuccess();
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess.prototype.deleteFolderContent = function (path) {        
        var directory = new System.IO.DirectoryInfo(path);
        var fileSystemInfos = System.Linq.Enumerable.ToList(directory.EnumerateFileSystemInfos());
        var length = fileSystemInfos.Count;
        var i, childFile, success = false;
        for (i = 0; i < length; i++) {
            fileSystemInfo = fileSystemInfos[i];
            if (fileSystemInfo.GetType().Name == "FileInfo") {
                fileSystemInfo.Delete();
            }
            else {
                System.IO.Directory.Delete(fileSystemInfo.FullName, true);
            }
            if (!success) {
                break;
            }
        }
        return success;
    };
    FileSystemAccess.prototype.ensureFile = function (fileSystem, isFolder, onError) {
        try {
            if (!fileSystem.Exists) {
                var created;
                if (isFolder) {
                    System.IO.Directory.CreateDirectory(fileSystem.FullName);
                    created = true;
                }
                else {
                    System.IO.File.Create(fileSystem.FullName).Close();
                    created = true;
                }
                if (!created) {
                    if (onError) {
                        onError("Failed to create new java File for path " + fileSystem.FullName);
                    }
                    return undefined;
                }
                else {
                }
            }
            var path = fileSystem.FullName;
            return { path: path, name: fileSystem.Name, extension: this.getFileExtension(path) };
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
            return undefined;
        }
    };
    FileSystemAccess.prototype.getFileExtension = function (path) {
        var dotIndex = path.lastIndexOf(".");
        if (dotIndex && dotIndex >= 0 && dotIndex < path.length) {
            return path.substring(dotIndex);
        }
        return "";
    };
    FileSystemAccess.prototype.enumEntities = function (path, callback, onError) {
        try {
            var directory = new System.IO.DirectoryInfo(path);
            var fileSystemInfos = System.Linq.Enumerable.ToList(directory.EnumerateFileSystemInfos());
            var length = fileSystemInfos.Count;
            var i;
            var info;
            var retVal;
            for (i = 0; i < length; i++) {
                fileSystemInfo = fileSystemInfos[i];
                info = {
                    path: fileSystemInfo.FullName,
                    name: fileSystemInfo.Name
                };
                if (fileSystemInfo.GetType().Name == "FileInfo") {
                    info.extension = this.getFileExtension(info.path);
                }
                retVal = callback(info);
                if (retVal === false) {
                    break;
                }
            }
        }
        catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
    };
    FileSystemAccess.prototype.getPathSeparator = function () {
        return this._pathSeparator;
    };
    FileSystemAccess.prototype.normalizePath = function (path) {
        var file = new System.IO.FileInfo(path);
        return file.FullName;
    };
    FileSystemAccess.prototype.joinPath = function (left, right) {
        return System.IO.Path.Combine(left, right);
    };
    FileSystemAccess.prototype.joinPaths = function (paths) {
        if (!paths || paths.length === 0) {
            return "";
        }
        if (paths.length === 1) {
            return paths[0];
        }
        var i, result = paths[0];
        for (i = 1; i < paths.length; i++) {
            result = this.joinPath(result, paths[i]);
        }
        return this.normalizePath(result);
    };
    return FileSystemAccess;
})();
exports.FileSystemAccess = FileSystemAccess;
