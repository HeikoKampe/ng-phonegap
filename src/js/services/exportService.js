angular.module(_SERVICES_).service('exportService', function ($q,
                                                              $rootScope,
                                                              $log,
                                                              $filter,
                                                              fileSystemAPI,
                                                              serverAPI,
                                                              appDataService,
                                                              storageService,
                                                              messageService,
                                                              eventService) {

  'use strict';

  function updateLocalData(uploadObj) {
    appDataService.resetPhotoDataAfterUpload(uploadObj.apiResult);
    appDataService.incrSyncId();

    return uploadObj;
  }

  function onUploadImageSuccess(uploadObject) {
    $rootScope.$evalAsync(function () {
      console.log('upload success: ', uploadObject.batchObject);
      updateLocalData(uploadObject);
      uploadObject.batchObject.successes++;
      uploadObject.batchObject.progress++;
      // all imports done?
      if (uploadObject.batchObject.nImports === uploadObject.batchObject.progress) {
        uploadObject.batchObject.deferredAll.resolve(uploadObject.batchObject);
      }
    });
  }

  function onUploadImageError(error, uploadObject) {

    if (error.message !== 'abort') {
      throw error;
    }

    $rootScope.$evalAsync(function () {
      uploadObject.batchObject.failures++;
      uploadObject.batchObject.progress++;
      // all imports done?
      if (uploadObject.batchObject.nImports === uploadObject.batchObject.progress) {
        uploadObject.batchObject.deferredAll.resolve(uploadObject.batchObject);
      }
    });
  }

  function loadImage(uploadObj) {
    var
      deferred = $q.defer();

    if (uploadObj.batchObject && uploadObj.batchObject.isCancelled) {
      console.log("abort");
      return deferred.reject(new Error('abort'));
    }

    storageService.loadImage(uploadObj.photoObj.id)
      .then(function (imageDataSrc) {
        uploadObj.photoObj.src = imageDataSrc;
        deferred.resolve(uploadObj);
      });

    return deferred.promise;
  }

  function uploadToServer(uploadObj) {
    var
      deferred = $q.defer();

    if (uploadObj.batchObject && uploadObj.batchObject.isCancelled) {
      console.log("abort");
      return deferred.reject(new Error('abort'));
    }

    serverAPI.uploadPhoto(uploadObj.photoObj, uploadObj.galleryId, {timeout: uploadObj.batchObject.deferredHttpTimeout.promise})
      .then(function (apiResult) {
        // add received data from API to uploadObj
        uploadObj.apiResult = apiResult.data;
        // delete imgDataSrc for releasing memory
        delete uploadObj.photoObj.src;
        deferred.resolve(uploadObj);
      });

    return deferred.promise;
  }



  function uploadPhoto(uploadObject) {
    loadImage(uploadObject)
      .then(uploadToServer)
      .then(storageService.renameImageVariants)
      .then(onUploadImageSuccess)
      .catch(function (error) {
        onUploadImageError(error, uploadObject)
      });
  }

  function uploadGalleryPhotos() {
    var
      galleryId = appDataService.getActiveGalleryId(),
      photoObjects = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(galleryId)),
      batchObject = {
        deferredAll: $q.defer(),
        deferredHttpTimeout: $q.defer(),
        nImports: photoObjects.length,
        progress: 0,
        failures: 0,
        successes: 0,
        isCancelled: false,
        cancel: function () {
          this.isCancelled = true;
          this.deferredHttpTimeout.resolve();
        }
      };

    // if there are new photos
    if (photoObjects.length) {

      angular.forEach(photoObjects, function (photoObj) {
        var
          uploadObject = {
            'batchObject': batchObject,
            'photoObj': photoObj,
            'galleryId': galleryId
          };

        uploadPhoto(uploadObject);
      });

    } else {
      batchObject.deferredAll.resolve();
    }

    return batchObject;
  }


  function uploadGallery() {
    var
      galleryData = appDataService.getGallery(),
      batchUpload;

    serverAPI.createGallery(galleryData)
      .then(function (apiResult) {
        $log.info('success: created remote gallery', galleryData);
        appDataService.resetGalleryData(apiResult.data);
      })
      .then(function () {
        batchUpload = uploadGalleryPhotos();
        messageService.startProgressMessage({title: 'Uploading photos', 'batchObject': batchUpload});
        return batchUpload.deferredAll.promise;
      })
      .then(function () {
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
      })
      .catch(function (e) {
        throw new Error("upload gallery", e);
      });
  }

  function uploadGallerySettings(galleryId, gallerySettings) {
    serverAPI.setGallerySettings(galleryId, gallerySettings)
      .then(function () {
        appDataService.incrSyncId();
        eventService.broadcast('GALLERY-UPDATE');
      });
  }


  return {
    uploadGalleryPhotos: uploadGalleryPhotos,
    uploadGallery: uploadGallery,
    uploadGallerySettings: uploadGallerySettings
  };

});