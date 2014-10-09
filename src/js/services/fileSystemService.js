//angular.module(_SERVICES_).service('fileSystemService', function ($rootScope, $q) {
//
//      /**
//       * Phonegap will provide access to the local file system via the global LocalFileSystem object
//       * Outside Phonegap - for development and testing purpose - we use the browsers file system api
//       */
//
//      var
//          fileSystem = null,
//          IMAGE_FILE_TYPE = 'image/jpeg';
//
//
//      function listImages(success, error) {
//        var
//            dirReader = fileSystem.root.createReader(),
//            entries = [],
//            fetchEntries,
//
//            fetchEntries = function () {
//              dirReader.readEntries(function (results) {
//                if (!results.length) {
//                  success(entries);
//                } else {
//                  entries = entries.concat(results);
//                  fetchEntries();
//                }
//              }, errorHandler);
//            };
//        fetchEntries();
//      }
//
//      function onFileSystemSuccess(fs) {
//        console.log('got filesystem with name: ', fs.name);
//        fileSystem = fs;
//
////    listImages().then(function (fileList) {
////      console.log('list of files: ', fileList);
////    });
//
//
//        listImages(function (fileList) {
//          console.log('list of filesxxx: ', fileList);
//        }, function () {
//          console.log('list of files error');
//        });
//
//      }
//
//      function initFileSystem(success) {
//        navigator.webkitPersistentStorage.requestQuota(1024 * 1024 * 5,
//            function (grantedSize) {
//              // Allow for vendor prefixes
//              window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//              // Request a file system with the new size
//              window.requestFileSystem(window.PERSISTENT, grantedSize, function (fs) {
//                onFileSystemSuccess(fs);
//                success();
//              }, errorHandler);
//            }, errorHandler);
//      }
//
//      function errorHandler(e) {
//        var msg = '';
//
//        switch (e.code) {
//          case FileError.QUOTA_EXCEEDED_ERR:
//            msg = 'QUOTA_EXCEEDED_ERR';
//            break;
//          case FileError.NOT_FOUND_ERR:
//            msg = 'NOT_FOUND_ERR';
//            break;
//          case FileError.SECURITY_ERR:
//            msg = 'SECURITY_ERR';
//            break;
//          case FileError.INVALID_MODIFICATION_ERR:
//            msg = 'INVALID_MODIFICATION_ERR';
//            break;
//          case FileError.INVALID_STATE_ERR:
//            msg = 'INVALID_STATE_ERR';
//            break;
//          default:
//            msg = 'Unknown Error';
//            break;
//        }
//        ;
//
//        console.log('Error: ' + msg);
//      }
//
//      function dataURItoBlob(dataURI) {
//        var binary = atob(dataURI.split(',')[1]), array = [];
//        for (var i = 0; i < binary.length; i++) array.push(binary.charCodeAt(i));
//        return new Blob([new Uint8Array(array)], {type: IMAGE_FILE_TYPE});
//      }
//
//
//      function onGetFileSuccess(file) {
//        console.log("onGetFileSuccess: ", file);
//      }
//
//      function onGetFileError(error) {
//        console.log("onGetFileError: ", error);
//      }
//
//
//      function saveImage(photoObj, success, error) {
//        fileSystem.root.getFile(photoObj.name, {create: true}, function (fileEntry) {
//
//          fileEntry.createWriter(function (fileWriter) {
//
//            fileWriter.onwriteend = function (e) {
//              success(e);
//            };
//
//            fileWriter.onerror = function (e) {
//              console.log('Write error: ' + e.toString());
//              error(e);
//            };
//            $rootScope.$apply(function () {
//              fileWriter.write(dataURItoBlob(photoObj.mainImg));
//
//            }, errorHandler);
//
//          }, errorHandler);
//        });
//      }
//
//      function saveFile(name, file, success, error) {
//        fileSystem.root.getFile(name, {create: true}, function (fileEntry) {
//
//          fileEntry.createWriter(function (fileWriter) {
//
//            fileWriter.onwriteend = function (e) {
//              success(fileEntry.toURL());
//            };
//
//            fileWriter.onerror = function (e) {
//              console.log('Write error: ' + e.toString());
//              error(e);
//            };
//            $rootScope.$apply(function () {
//              fileWriter.write(file);
//
//            }, errorHandler);
//
//          }, errorHandler);
//        });
//      }
//
//      function saveTextFile(name, contents, success, error) {
//        fileSystem.root.getFile(name, {create: true}, function (fileEntry) {
//
//          fileEntry.createWriter(function (fileWriter) {
//
//            fileWriter.onwriteend = function (e) {
//              success(e);
//            };
//
//            fileWriter.onerror = function (e) {
//              console.log('Write error: ' + e.toString());
//              error(e);
//            };
//
//            var blob = new Blob([contents], {type: 'text/plain'});
//
//            $rootScope.$apply(function () {
//              fileWriter.write(blob);
//
//            }, errorHandler);
//
//          }, errorHandler);
//        });
//      }
//
//
//      function deleteFile(filename) {
//        fileSystem.root.getFile(filename, {create: false}, function (fileEntry) {
//
//          fileEntry.remove(function (e) {
//            // Update the file browser.
//            listImages();
//
//            // Show a deleted message.
//            console.log('File deleted!');
//          }, errorHandler);
//
//        }, errorHandler);
//      }
//
//      function loadFile(fileName) {
//        fileSystem.root.getFile(fileName, {}, function (fileEntry) {
//
//          fileEntry.file(function (file) {
//            var reader = new FileReader();
//
//            reader.onload = function (e) {
//              // Update the form fields.
//              console.log('readerResult: ', reader.result);
//            };
//
//            reader.readAsText(file);
//          }, errorHandler);
//
//        }, errorHandler);
//      }
//
//
//      return {
//        initFileSystem: initFileSystem,
//        saveImage: saveImage,
//        saveTextFile: saveTextFile,
//        deleteFile: deleteFile,
//        listImages: listImages,
//        saveFile: saveFile
//      }
//
//    }
//
//)
//;
//
