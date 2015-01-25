angular.module(_SERVICES_).factory('fileSystemAPI', function ($q, html5FileSystem) {
  'use strict';

  /**
   * ios filesystem ids:
   * 0: /tmp
   * 1: /Documents
   * 3: /Library                                             --> for the app data file
   * 4: /Library/NoCloud      (cordova.file.dataDirectory)   --> for the thumbnails
   * 5: /Documents
   * 6: /Documents/NoCloud
   * 7: /Library/Caches       (cordova.file.cacheDirectory)   --> for the large images
   */

  var fs = html5FileSystem;
  //var fs = $cordovaFile;

  function checkDir (directory, fileSystemId) {
    return fs.checkDir(directory, fileSystemId);
  }

  function createDir (directory, replaceBOOL, fileSystemId) {
    return fs.createDir(directory, replaceBOOL, fileSystemId);
  }

  function listDir (directory, fileSystemId) {
    return fs.listDir(directory, fileSystemId)
  }

  function checkFile (filePath, fileSystemId) {
    return fs.checkFile(filePath, fileSystemId);
  }

  function createFile (filePath, replaceBOOL, fileSystemId) {
    return fs.createFile(filePath, replaceBOOL, fileSystemId);
  }

  function removeFile (filePath, fileSystemId) {
    return fs.removeFile(filePath, fileSystemId);
  }

  function writeFile (filePath, data, fileSystemId) {
    return fs.writeFile(filePath, data, {}, fileSystemId);
  }

  function readFile (filePath, fileSystemId) {
    return fs.readAsText(filePath, fileSystemId);
  }

  function renameFile (dir, oldFileName, newFileName, fileSystemId) {
    return fs.renameFile(dir, oldFileName, newFileName, fileSystemId);
  }


  return {
    checkDir: checkDir,
    createDir: createDir,
    listDir: listDir,
    checkFile: checkFile,
    createFile: createFile,
    removeFile: removeFile,
    writeFile: writeFile,
    readFile: readFile,
    renameFile: renameFile
  }

});