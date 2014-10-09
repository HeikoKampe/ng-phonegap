angular.module(_SERVICES_).factory('fileSystemAPI', function ($q, html5FileSystem, phoneGapFileSystem) {
  'use strict';

  var fs = html5FileSystem;
//  var fs = phoneGapFileSystem;

  function requestFileSystem (quota) {
    return fs.requestFileSystem(quota);
  }

  function writeFile (name, content) {
    return fs.writeFile (name, content);
  }

  function readFile (name, returnType) {
    return fs.readFile(name, returnType);
  }

  function deleteFile (fullPath) {
    return fs.deleteFile (fullPath);
  }

  function renameFile (dir, oldFileName, newFileName) {
    return fs.renameFile (dir, oldFileName, newFileName);
  }

  function createFolder (path) {
    return fs.createFolder (path);
  }

  return {
    requestFileSystem: requestFileSystem,
    writeFile: writeFile,
    readFile: readFile,
    deleteFile: deleteFile,
    renameFile: renameFile,
    createFolder: createFolder
  }

});