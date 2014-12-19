angular.module(_SERVICES_).service('fileReaderService', function ($q, $log) {

  function getImageAsDataURL(importObj) {
    var
      fileReader = new FileReader(),
      deferred = $q.defer();

    if (importObj.batchObject && importObj.batchObject.isCancelled) {
      deferred.reject(new Error('abort'));
    }

    fileReader.onload = function () {
      if (/image/.test(importObj.photoObj.file.type)) {
        importObj.photoObj.url = fileReader.result;
        deferred.resolve(importObj);
      } else {
        deferred.reject(new Error('file is not of type image'));
      }
    };

    fileReader.readAsDataURL(importObj.photoObj.file);
    return deferred.promise;
  }

  return {
    getImageAsDataURL: getImageAsDataURL
  }

});
