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
    appDataService.setSyncId(uploadObj.apiResult.syncId, uploadObj.galleryId);

    return uploadObj;
  }

  function loadImage(uploadObj) {
    var
      deferred = $q.defer();

    if (uploadObj.batchObject && uploadObj.batchObject.cancelObject.isCancelled) {
      deferred.reject(new Error('cancel batch'));
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
      deferred.reject(new Error('cancel batch'));
    } else {
      serverAPI.uploadPhoto(uploadObj.photoObj, uploadObj.galleryId, {timeout: uploadObj.batchObject.cancelObject.deferredHttpTimeout.promise})
        .then(function (apiResult) {
          // add received data from API to uploadObj
          uploadObj.apiResult = apiResult;
          // delete imgDataSrc for releasing memory
          delete uploadObj.photoObj.src;
          deferred.resolve(uploadObj);
        }, function (err) {
          if (uploadObj.batchObject.cancelObject.isCancelled === true) {
            deferred.reject(new Error('cancel batch'));
          } else {
            deferred.reject(new Error(err));
          }
        });
    }

    return deferred.promise;
  }

  // check photo limit again in case new photos where added right before upload
  function photosLimitNotReached (galleryId) {
    var
      nGalleryPhotos = appDataService.getNumberOfPhotos(galleryId),
      maxPhotos = appDataService.getPhotosLimit(galleryId);

    console.log('photosLimitNotReached',nGalleryPhotos);

    return nGalleryPhotos <= maxPhotos;
  }

  function onUploadImageSuccess(uploadObject) {
    uploadObject.batchObject.onSuccess();
    updateLocalData(uploadObject);
    if (uploadObject.batchObject.hasNext()){
      uploadImage(uploadObject.batchObject, uploadObject.galleryId);
    }
  }

  function onUploadImageError(error, uploadObject) {
    uploadObject.batchObject.onError(error);
    if (uploadObject.batchObject.hasNext()){
      uploadImage(uploadObject.batchObject, uploadObject.galleryId);
    }
  }


  function uploadImage(batchObject, galleryId) {
    var
    // create an photo upload object with a reference to the batch object
    // the reference is needed as a handle for cancelling the batch operation (cancel all)
      uploadObject = {
        'batchObject': batchObject,
        // use a copy of the photo object for the upload to prevent the loaded data source of the image
        // from getting into the locally stored data model
        'photoObj': angular.copy(batchObject.getNext()),
        'galleryId': galleryId
      };

    // adding ownerId makes it easier to get the photos limit for a gallery on the server side
    // the photos limit of the gallery owner should be deceicive and not the limit of the uploader
    // (in case it is an upload to an foreign gallery
    uploadObject.photoObj.galleryOwnerId = appDataService.getGalleryOwnerId(galleryId);

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
      batchObject = batchFactoryService.createBatchObject(photoObjects);

    // if there are new photos
    if (photoObjects && photoObjects.length && photosLimitNotReached(galleryId)) {
      messageService.updateProgressMessage({'prefix': 'uploading', 'batchObject': batchObject});

      // start serial export of images
      // serial export is more robust against errors (lost connections) and makes it easier
      // to enforce limits (max. number of photos per gallery) on the server
      uploadImage(batchObject, galleryId);

    } else {
      deferred.resolve();
    }

    batchObject.deferred.promise
      .then(deferred.resolve, deferred.reject);

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
        appDataService.resetGalleryData(apiResult);
      })
      .then(uploadGalleryPhotos)
      .then(deferred.resolve)
      .catch(function (error) {
        // on error
        if (error.message === 'cancel batch') {
          messageService.updateProgressMessage({suffix: 'cancelling ...'});
        } else {
          throw new Error(error);
        }
        deferred.reject(error);
      })
      .finally(function(){
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
      });

    return deferred.promise;
  }

  function updateUploadPermission(galleryId, uploadPermission) {
    serverAPI.updateUploadPermission(galleryId, uploadPermission)
      .then(function (apiResult) {
        appDataService.setSyncId(apiResult.syncId, apiResult.galleryId);
        eventService.broadcast('GALLERY-UPDATE');
      });
  }


  return {
    uploadGalleryPhotos: uploadGalleryPhotos,
    uploadGallery: uploadGallery,
    updateUploadPermission: updateUploadPermission
  };

});