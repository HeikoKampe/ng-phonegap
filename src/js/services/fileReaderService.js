angular.module(_SERVICES_).service('fileReaderService', function ($q, $log) {

  function getImageAsDataURL(importObj) {
    var
      fileReader = new FileReader(),
      deferredPhotoObject = $q.defer();

    fileReader.onload = function () {
      if (/image/.test(importObj.photoObj.file.type)) {
        importObj.photoObj.url = fileReader.result;
        deferredPhotoObject.resolve(importObj);
      } else {
        $log.error('file is not of type image');
        deferredPhotoObject.reject(new Error('file is not of type image'));
      }
    };

    fileReader.readAsDataURL(importObj.photoObj.file);
    return deferredPhotoObject.promise;
  }

  return {
    getImageAsDataURL: getImageAsDataURL
  }

});
