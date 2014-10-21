angular.module(_SERVICES_).factory('fileSystemAPI', function ($q, $cordovaFile, html5FileSystem, phoneGapFileSystem) {
  'use strict';

  //Filesystem (checkDir, createDir, checkFile, creatFile, removeFile, writeFile, readFile)

//  var fs = html5FileSystem;
  var fs = $cordovaFile;

//  if ($window.webkitRequestFileSystem) {
//    fs = html5FileSystem2;
//  } else {
//    fs = $cordovaFile;
//  }
//

  function checkDir (directory) {
    return fs.checkDir(directory);
  }

  function createDir (directory, replaceBOOL) {
    return fs.createDir(directory, replaceBOOL);
  }

  function checkFile (filePath) {
    return fs.checkFile(filePath);
  }

  function createFile (filePath, replaceBOOL) {
    return fs.createFile(filePath, replaceBOOL);
  }

  function removeFile (filePath) {
    return fs.removeFile(filePath);
  }

  function writeFile (filePath, data) {
    return fs.writeFile(filePath, data, {});
  }

  function readFile (filePath) {
    return fs.readAsText(filePath);
  }




  function renameFile (dir, oldFileName, newFileName) {
    return fs.renameFile(dir, oldFileName, newFileName);
  }



  return {
    checkDir: checkDir,
    createDir: createDir,
    checkFile: checkFile,
    createFile: createFile,
    removeFile: removeFile,
    writeFile: writeFile,
    readFile: readFile,
    renameFile: renameFile
  }

});