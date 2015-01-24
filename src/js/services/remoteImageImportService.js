'use strict';

angular.module(_SERVICES_).service('remoteImageImportService', function ($q,
                                                                         appDataService,
                                                                         serverAPI,
                                                                         imageVariantsService,
                                                                         storageService,
                                                                         eventService,
                                                                         messageService,
                                                                         batchFactoryService) {


  function getSignedUrlBatch(importObj) {
    var deferred = $q.defer();

    if (importObj.batchObject && importObj.batchObject.cancelObject.isCancelled) {
      deferred.reject(new Error('cancel batch'));
    }

    // signed urls on initial gallery import are already provided by the server
    if (importObj.photoObj.url) {
      deferred.resolve(importObj)
    } else {
      serverAPI.getSignedImageUrl(importObj.galleryId, importObj.photoObj.id, {timeout: importObj.batchObject.cancelObject.deferredHttpTimeout.promise}).then(function (result) {
        importObj.photoObj.url = result.data.signedUrl;
        deferred.resolve(importObj);
      }, function (err) {
        if (importObj.batchObject.cancelObject.isCancelled === true) {
          deferred.reject(new Error('cancel batch'));
        } else {
          throw new Error('could not get signed url for image');
        }
      });
    }

    return deferred.promise;
  }

  function getSignedUrl(importObj) {
    var deferred = $q.defer();

    serverAPI.getSignedImageUrl(importObj.galleryId, importObj.photoObj.id).then(function (result) {
      importObj.photoObj.url = result.data.signedUrl;
      deferred.resolve(importObj);
    }, function(){
      console.log('caching image failed');
      deferred.reject();
    });

  return deferred.promise;
}

function onImportRemoteImageSuccess(importObject) {
  importObject.batchObject.onSuccess();
  appDataService.addPhotoToGallery(importObject.photoObj, importObject.galleryId);
}

function onImportRemoteImageError(error, importObject) {
  importObject.batchObject.onError(error);
}

function importRemoteImage(batchObject, galleryId) {
  var
  // create an import object with a reference to the batch object
    importObject = {
      'batchObject': batchObject,
      'photoObj': batchObject.getNext(),
      'galleryId': galleryId
    };

  // mark photo as not viewed
  importObject.photoObj.viewStatus = 0;

  getSignedUrlBatch(importObject)
    .then(imageVariantsService.createVariants)
    .then(storageService.saveImageVariants)
    .then(onImportRemoteImageSuccess)
    .catch(function (error) {
      onImportRemoteImageError(error, importObject)
    });
}

// Todo: move galleryId into batchObject
function importRemoteImages(photoObjects, galleryId, cancelObject) {
  var
    i,
    deferred = $q.defer(),
    batchObject;

  if (photoObjects && photoObjects.length) {
    batchObject = batchFactoryService.createBatchObject(photoObjects, cancelObject);
    messageService.updateProgressMessage({'prefix': 'Importing photos ...', 'batchObject': batchObject});

    // start parallel import of images
    for (i = 0; i < batchObject.stackLength; i++) {
      importRemoteImage(batchObject, galleryId);
    }

    batchObject.deferred.promise.then(function () {
      deferred.resolve();
    }, function (error) {
      deferred.reject(error);
    });

  } else {
    deferred.resolve();
  }

  return deferred.promise;
}

// if image was imported before but not found on local filesystem anymore, try to save it to local filesystem again
function cacheImage(photoId, galleryId) {
  var
    importObject = {
      'photoObj': {
        id: photoId
      },
      'galleryId': galleryId
    };

  return getSignedUrl(importObject)
    .then(imageVariantsService.createVariants)
    .then(storageService.saveImageVariants);
}

return {
  importRemoteImages: importRemoteImages,
  cacheImage: cacheImage
}

})
;