// install   :     cordova plugin add org.apache.cordova.file
// link      :     https://github.com/apache/cordova-plugin-file/blob/master/doc/index.md

// TODO: add functionality to define storage size in the getFilesystem() -> requestFileSystem() method
// TODO: add documentation for FileError types
// TODO: add abort() option to downloadFile and uploadFile methods.
// TODO: add support for downloadFile and uploadFile options. (or detailed documentation) -> for fileKey, fileName, mimeType, headers
// TODO: add support for onprogress property

angular.module(_SERVICES_).factory('html5FileSystem', function ($window, $q, $timeout, $log) {

  return {
    checkDir: function (dir, fileSystemId) {
      return getDirectory(dir, {create: false}, fileSystemId);
    },

    createDir: function (dir, replaceBOOL, fileSystemId) {
      return getDirectory(dir, {create: true, exclusive: replaceBOOL}, fileSystemId);
    },

    listDir: function (filePath, fileSystemId) {
      var q = $q.defer();

      getDirectory(filePath, {create: false}, fileSystemId)
        .then(function (parent) {
          var reader = parent.createReader();
          reader.readEntries(
            function (entries) {
              q.resolve(entries);
            },
            function () {
              q.reject('DIR_READ_ERROR : ' + filePath);
            });
        }, function () {
          q.reject('DIR_NOT_FOUND : ' + filePath);
        });

      return q.promise;
    },

    checkFile: function (filePath, fileSystemId) {
      return getFileEntry(filePath, {create: false}, fileSystemId);
    },

    createFile: function (filePath, replaceBOOL, fileSystemId) {
      return getFileEntry(filePath, {create: true, exclusive: replaceBOOL}, fileSystemId);
    },

    removeFile: function (filePath, fileSystemId) {
      var q = $q.defer();

      getFileEntry(filePath, {create: false}, fileSystemId)
        .then(function (fileEntry) {
          fileEntry.remove(q.resolve, q.reject);
        }, q.reject);

      return q.promise;
    },

    // options is a dict with possible keys :
    // - append : true/false (if true, append data on EOF)
    writeFile: function (filePath, data, options, fileSystemId) {
      var q = $q.defer();

      getFileWriter(filePath, {create: true}, fileSystemId)
        .then(function (fileWriter) {
          var truncated = false;
          if (options['append'] === true) {
            // Start write position at EOF.
            fileWriter.seek(fileWriter.length);
          }
          fileWriter.onwriteend = function (evt) {
            if (this.error)
              q.reject(this.error);
            else {
              //truncate all data after current position
              if (!truncated) {
                truncated = true;
                this.truncate(this.position);
                q.resolve(evt);
              }
            }
          };
          // create text blob from string
          // webkit only allows blobs written to text files
          var blob = new Blob([data], {type: 'text/plain'});
          fileWriter.write(blob);
        }, q.reject);

      return q.promise;
    },

    readAsText: function (filePath, fileSystemId) {
      var q = $q.defer();

      getFile(filePath, {create: false}, fileSystemId)
        .then(function (file) {
          getPromisedFileReader(q).readAsText(file);
        }, q.reject);

      return q.promise;
    },


    readAsDataURL: function (filePath, fileSystemId) {
      var q = $q.defer();

      getFile(filePath, {create: false}, fileSystemId)
        .then(function (file) {
          getPromisedFileReader(q).readAsDataURL(file);
        }, q.reject);

      return q.promise;
    },

    readAsBinaryString: function (filePath) {
      var q = $q.defer();

      getFile(filePath, {create: false})
        .then(function (file) {
          getPromisedFileReader(q).readAsBinaryString(file);
        }, q.reject);

      return q.promise;
    },

    readAsArrayBuffer: function (filePath) {
      var q = $q.defer();

      getFile(filePath, {create: false})
        .then(function (file) {
          getPromisedFileReader(q).readAsArrayBuffer(file);
        }, q.reject);

      return q.promise;
    },

    readFileMetadata: function (filePath) {
      return getFile(filePath, {create: false});
    },

    readFileAbsolute: function (filePath) {
      var q = $q.defer();
      getAbsoluteFile(filePath)
        .then(function (file) {
          getPromisedFileReader(q).readAsText(file);
        }, q.reject);
      return q.promise;
    },

    readFileMetadataAbsolute: function (filePath) {
      return getAbsoluteFile(filePath);
    },

    downloadFile: function (source, filePath, trustAllHosts, options) {
      var q = $q.defer();
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(source);

      fileTransfer.onprogress = q.notify;
      fileTransfer.download(uri, filePath, q.resolve, q.reject, trustAllHosts, options);
      return q.promise;
    },

    uploadFile: function (server, filePath, options) {
      var q = $q.defer();
      var fileTransfer = new FileTransfer();
      var uri = encodeURI(server);

      fileTransfer.onprogress = q.notify;
      fileTransfer.upload(filePath, uri, q.resolve, q.reject, options);
      return q.promise;
    },


    // CUSTOM FUNCTION
    // CAREFUL WHEN UPDATING
    renameFile: function (dir, oldFileName, newFileName, fileSystemId) {
      var q = $q.defer();

       getDirectory(dir, {}, fileSystemId)
        .then(function (dirEntry) {
          var filePath = (dir === '' || dir === '/') ? oldFileName : dir + '/' + oldFileName;
          getFileEntry(filePath, {}, fileSystemId)
            .then(function (fileEntry) {
              fileEntry.moveTo(dirEntry, newFileName, q.resolve, q.reject)
            }, q.reject);
        }, q.reject);

      return q.promise;
    }
  };

  /*
   * Returns a new FileReader that will resolve the provided Deferred with
   * the result of the next method called on the FileReader, or reject it
   * if an error occurs while attempting to complete that operation.
   */
  function getPromisedFileReader(deferred) {
    var reader = new FileReader();
    reader.onloadend = function () {
      if (this.error)
        deferred.reject(this.error);
      else
        deferred.resolve(this.result);
    };
    return reader;
  }

  /*
   * Returns a promise that will be resolved with the requested File object
   * or rejected if an error occurs attempting to retreive it.
   */
  function getFile(path, options, fileSystemId) {
    var q = $q.defer();
    getFileEntry(path, options, fileSystemId)
      .then(function (fileEntry) {
        fileEntry.file(q.resolve, q.reject);
      }, q.reject);
    return q.promise;
  }

  /*
   * Returns a promise that will either be resolved with a FileWriter bound to the file identified
   * in the provided path or rejected if an error occurs while attempting to initialize
   * the writer.
   */
  function getFileWriter(path, options, fileSystemId) {
    var q = $q.defer();
    getFileEntry(path, options, fileSystemId)
      .then(function (fileEntry) {
        fileEntry.createWriter(q.resolve, q.reject);
      }, q.reject);
    return q.promise;
  }

  /*
   * Returns a promise that will either be resolved with the FileEntry instance that corresponds
   * to the provided path or rejected if an error occurs while attempting to retrieve the
   * FileEntry.
   */
  function getFileEntry(path, options, fileSystemId) {
    var q = $q.defer();
    getFilesystem(fileSystemId).then(
      function (filesystem) {
        filesystem.root.getFile(path, options, q.resolve, q.reject);
      }, q.reject);
    return q.promise;
  }

  /*
   * Returns a promise that will either be resolved with the File object associated with the requested
   * absolute path, or rejected if an error occurs while trying to initialize that File object.
   */
  function getAbsoluteFile(path) {
    var q = $q.defer();
    $window.resolveLocalFileSystemURL(path,
      function (fileEntry) {
        fileEntry.file(q.resolve, q.reject);
      }, q.reject);
    return q.promise;
  }

  /*
   * Returns a promise that will either be resolved with the Directory object associated with
   * the requested directory or rejected if an error occurs while atempting to access that directory.
   */
  function getDirectory(dir, options, fileSystemId) {
    var q = $q.defer();
    getFilesystem(fileSystemId).then(
      function (filesystem) {
        filesystem.root.getDirectory(dir, options, q.resolve, q.resolve);
      }, q.reject);
    return q.promise;
  }

  /*
   * Returns a Promise that will be either resolved with the FileSystem object associated
   * with the device's persistent file system and with 1MB of storage reserved for it,
   * or rejected if an error occurs while trying to accessing the FileSystem
   */
  function getFilesystem(fileSystemId) {
    var
      q = $q.defer();

    if (navigator.webkitPersistentStorage) {
      navigator.webkitPersistentStorage.requestQuota(100 * 1024 * 1024, function (grantedBytes) {
        $window.webkitRequestFileSystem($window.PERSISTENT, grantedBytes, q.resolve, q.reject);
      });
    } else {
      $window.requestFileSystem(fileSystemId, 0, q.resolve, q.reject);
    }

    return q.promise;
  }


});

