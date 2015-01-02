angular.module(_SERVICES_).service('fileReaderService', function ($q, $log) {

  function getImageAsDataURL(importObj) {
    var
      fileReader = new FileReader(),
      deferred = $q.defer();

    fileReader.onload = function () {
      if (/image/.test(importObj.photoObj.file.type)) {
        importObj.photoObj.url = fileReader.result;
        deferred.resolve(importObj);
      } else {
        deferred.reject(new Error('file is not of type image'));
      }
    };

    if (importObj.batchObject && importObj.batchObject.cancelObject.isCancelled) {
      deferred.reject(new Error('cancel batch'));
    } else {
      fileReader.readAsDataURL(importObj.photoObj.file);
    }

    return deferred.promise;
  }

  return {
    getImageAsDataURL: getImageAsDataURL
  }

});
