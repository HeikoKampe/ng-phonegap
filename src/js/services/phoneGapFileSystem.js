
angular.module(_SERVICES_).factory('phoneGapFileSystem', function ($window, $q, $timeout, $log) {
  var fsDefer = $q.defer();

  var DEFAULT_QUOTA_MB = 10;

  //wrap resolve/reject in an empty $timeout so it happens within the Angular call stack
  //easier than .apply() since no scope is needed and doesn't error if already within an apply
  function safeResolve(deferral, message) {
    $timeout(function () {
      deferral.resolve(message);
    });
  }

  function safeReject(deferral, message) {
    $timeout(function () {
      deferral.reject(message);
      throw(message.obj);
    });
  }

  function requestFileSystem(quota) {
    // Allow for vendor prefixes
    quota = (typeof quota == 'undefined' ? DEFAULT_QUOTA_MB : quota);

    $window.requestFileSystem(LocalFileSystem.PERSISTENT, quota * 1024 * 1024, function (fs) {
            safeResolve(fsDefer, fs);
          }, function (e) {
            safeReject(fsDefer, {text: "Error requesting File System access", obj: e});
          });

    return fsDefer.promise;
  }


  function writeFile(fileName, content, append) {
    append = (typeof append == 'undefined' ? false : append);

    var def = $q.defer();

    fsDefer.promise.then(function (fs) {

      fs.root.getFile(fileName, {create: true}, function (fileEntry) {

        fileEntry.createWriter(function (fileWriter) {
          if (append) {
            fileWriter.seek(fileWriter.length);
          }

          var truncated = false;
          fileWriter.onwriteend = function (e) {
            console.log('onwriteend: ', fileEntry.toURL());
            //truncate all data after current position
            if (!truncated) {
              truncated = true;
              this.truncate(this.position);
              return;
            }
            safeResolve(def, fileEntry.toURL());
          };

          fileWriter.onerror = function (e) {
            safeReject(def, {text: 'Write failed', obj: e});
          };

          fileWriter.write(content);

        }, function (e) {
          safeReject(def, {text: "Error creating file", obj: e});
        });

      }, function (e) {
        safeReject(def, {text: "Error getting file", obj: e});
      });

    }, function (err) {
      def.reject(err);
    });

    return def.promise;
  }


  function readFile(fileName, returnType) {
    var def = $q.defer();

    returnType = returnType || "text";

    fsDefer.promise.then(function (fs) {
      fs.root.getFile(fileName, {}, function (fileEntry) {
        // Get a File object representing the file,
        // then use FileReader to read its contents.
        fileEntry.file(function (file) {
          var reader = new FileReader();

          reader.onloadend = function () {
            safeResolve(def, this.result);
          };

          reader.onerror = function (e) {
            safeReject(def, {text: "Error reading file", obj: e});
          };


          switch (returnType) {
            case 'arraybuffer':
              reader.readAsArrayBuffer(file);
              break;
            case 'binarystring':
              reader.readAsBinaryString(file);
              break;
            case 'dataurl':
              reader.readAsDataURL(file);
              break;
            default:
              reader.readAsText(file);
          }
        }, function (e) {
          safeReject(def, {text: "Error getting file", obj: e});
        });
      }, function (e) {
        safeReject(def, {text: "Error getting file", obj: e});
      });
    }, function (err) {
      def.reject(err);
    });

    return def.promise;
  }

  function deleteFile(fullPath) {
    var def = $q.defer();

    fsDefer.promise.then(function (fs) {
      fs.root.getFile(fullPath, {create: false}, function (fileEntry) {
        fileEntry.remove(function () {
          safeResolve(def, "");
        }, function (e) {
          safeReject(def, {text: "Error deleting file", obj: e});
        });
      });
    }, function (err) {
      def.reject(err);
    });

    return def.promise;
  }



  return {
    requestFileSystem: requestFileSystem,
    writeFile: writeFile,
    readFile: readFile,
    deleteFile: deleteFile
  };

});

