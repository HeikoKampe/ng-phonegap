angular.module(_SERVICES_).service('exportService', function ($q,
                                                              $rootScope,
                                                              $log,
                                                              $filter,
                                                              fileSystemAPI,
                                                              serverAPI,
                                                              appDataService,
                                                              storageService,
                                                              messageService,
                                                              eventService,
                                                              batchFactoryService) {

  'use strict';

  function updateLocalData(uploadObj) {
    appDataService.resetPhotoDataAfterUpload(uploadObj.apiResult);
    appDataService.incrSyncId();

    return uploadObj;
  }

  function loadImage(uploadObj) {
    var
      deferred = $q.defer();

    if (uploadObj.batchObject && uploadObj.batchObject.isCancelled) {
      console.log("abort");
      return deferred.reject(new Error('cancel batch'));
    } else {
      storageService.loadImage(uploadObj.photoObj.id)
        .then(function (imageDataSrc) {
          uploadObj.photoObj.src = imageDataSrc;
          deferred.resolve(uploadObj);
        });
    }

    return deferred.promise;
  }

  function uploadToServer(uploadObj) {
    var
      deferred = $q.defer();

    if (uploadObj.batchObject && uploadObj.batchObject.isCancelled) {
      console.log("abort");
      return deferred.reject(new Error('cancel batch'));
    } else {
      serverAPI.uploadPhoto(uploadObj.photoObj, uploadObj.galleryId, {timeout: uploadObj.batchObject.deferredHttpTimeout.promise})
        .then(function (apiResult) {
          // add received data from API to uploadObj
          uploadObj.apiResult = apiResult.data;
          // delete imgDataSrc for releasing memory
          delete uploadObj.photoObj.src;
          deferred.resolve(uploadObj);
        }, function (err) {
          if (uploadObj.batchObject.cancelObject.isCancelled === true) {
            deferred.reject(new Error('cancel batch'));
          } else {
            throw new Error('upload to server failed');
          }
        });
    }

    return deferred.promise;
  }

  function onUploadImageSuccess(uploadObject) {
    uploadObject.batchObject.onSuccess();
    updateLocalData(uploadObject);
    if (uploadObject.batchObject.hasNext()) {
      //uploadImage(uploadObject.batchObject, uploadObject.galleryId)
    }
  }

  function onUploadImageError(error, uploadObject) {
    uploadObject.batchObject.onError(error);
  }


  function uploadImage(batchObject, galleryId) {
    var
    // create an photo upload object with a reference to the batch object
      uploadObject = {
        'batchObject': batchObject,
        // use a copy of the photo object for the upload to prevent the loaded data source of the image
        // from getting into the locally stored data model
        'photoObj': angular.copy(batchObject.getNext()),
        'galleryId': galleryId
      };

    loadImage(uploadObject)
      .then(uploadToServer)
      .then(storageService.renameImageVariantsAfterUpload)
      .then(onUploadImageSuccess)
      .catch(function (error) {
        onUploadImageError(error, uploadObject)
      });
  }

  function uploadGalleryPhotos() {
    var
      deferred = $q.defer(),
      galleryId = appDataService.getActiveGalleryId(),
      photoObjects = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(galleryId)),
      batchObject = batchFactoryService.createBatchObject(photoObjects, {isCancelled: false});

    // if there are new photos
    if (photoObjects && photoObjects.length) {
      messageService.updateProgressMessage({'batchObject': batchObject});
      //// start serial upload of images
      //uploadImage(batchObject, galleryId);


      // start parallel import of images
      var i;
      for (i = 0; i < batchObject.stackLength; i++) {
        uploadImage(batchObject, galleryId);
      }


    } else {
      deferred.resolve();
    }

    batchObject.deferred.promise.then(function () {
      deferred.resolve();
    }, function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }


  function uploadGallery() {
    var
      deferred = $q.defer(),
      galleryData = appDataService.getGallery();

    messageService.startProgressMessage({title: 'Uploading gallery'});

    serverAPI.createGallery(galleryData)
      .then(function (apiResult) {
        $log.info('success: created remote gallery', galleryData);
        appDataService.resetGalleryData(apiResult.data);
      })
      .then(uploadGalleryPhotos)
      .then(function () {
        // on success
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
        deferred.resolve();
      }, function (error) {
        // on error
        if (error.message === 'cancel batch') {
          messageService.updateProgressMessage({content: 'cancelling ...'});
          messageService.endProgressMessage();
          deferred.reject(error);
        } else {
          throw error;
        }
        eventService.broadcast('GALLERY-UPDATE');
        console.log('uploadGallery error: ', error);
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