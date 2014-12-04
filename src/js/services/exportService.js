angular.module(_SERVICES_).service('exportService', function ($q,
                                                              $log,
                                                              $filter,
                                                              fileSystemAPI,
                                                              serverAPI,
                                                              appDataService,
                                                              storageService,
                                                              messageService,
                                                              eventService) {

  'use strict';

  function errorHandler(e) {
    throw new Error(e);
  }

  function createUploadObject(uploadObjects, uploadIndex, deferred, galleryId, errors) {
    var photoObjCopy = angular.copy(uploadObjects[uploadIndex]);

    photoObjCopy.galleryId = galleryId;

    return {
      'uploadObjects': uploadObjects,
      'uploadObjectIndex': uploadIndex,
      'deferred': deferred,
      'errors': errors || {},
      'photoObj': photoObjCopy
    };
  }

  function onUploadProgress(uploadObj) {
    var messageData = {
      content: uploadObj.photoObj.name,
      totalLength: uploadObj.uploadObjects.length,
      progressIndex: uploadObj.uploadObjectIndex + 1
    };
    messageService.updateProgressMessage(messageData);
  }

  function loadImage(uploadObj) {
    return storageService.loadImage(uploadObj.photoObj.id)
      .then(function (imageDataSrc) {
        uploadObj.photoObj.src = imageDataSrc;
        return uploadObj;
      });
  }

  function uploadToServer(uploadObj) {
    return serverAPI.uploadPhoto(uploadObj.photoObj, uploadObj.photoObj.galleryId)
      .then(function (apiResult) {
        // add received data from API to uploadObj
        uploadObj.apiResult = apiResult.data;
        // delete imgDataSrc for releasing memory
        uploadObj.photoObj.src = '';
        return uploadObj;
      });
  }

  function updateLocalData(uploadObj) {
    appDataService.resetPhotoData(uploadObj);
    appDataService.incrSyncId();
    onUploadProgress(uploadObj);

    return uploadObj;
  }

  function uploadPhoto(uploadObjects, uploadIndex, deferred, galleryId, errors) {
    var uploadObj = createUploadObject(uploadObjects, uploadIndex, deferred, galleryId, errors);

    onUploadProgress(uploadObj);

    return loadImage(uploadObj)
      .then(uploadToServer)
      .then(storageService.renameImageVariants)
      .catch(function (error) {
        // add error to error property of export object
        uploadObj.errors[uploadObj.uploadObjectIndex] = error;
        return $q.when(uploadObj);
      });
  }

  // PARALLEL UPLOAD
  //
  //function exportGalleryPhotos() {
  //  var
  //    promises = [],
  //    deferred = $q.defer(),
  //    galleryId = appDataService.getActiveGalleryId(),
  //    photoObjects = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(galleryId));
  //
  //  angular.forEach(photoObjects, function (photoObj) {
  //    var uploadObj;
  //    // check if photo is not already marked as deleted
  //    if (!photoObj.deleted) {
  //      uploadObj = createUploadObject(photoObj, galleryId);
  //      promises.push(uploadPhoto(uploadObj));
  //    }
  //  });
  //
  //  $q.all(promises).then(function (result) {
  //    messageService.endProgressMessage();
  //    deferred.resolve(result);
  //  });
  //
  //  return deferred.promise;
  //}

  function onPhotoUploadDone(uploadObj){
    var uploadIndex;

    if (uploadObj.errors[uploadObj.uploadObjectIndex]) {
      // todo
    } else {
      updateLocalData(uploadObj);
    }

    uploadIndex = uploadObj.uploadObjectIndex + 1;

    if (uploadIndex < uploadObj.uploadObjects.length) {
      uploadPhoto(uploadObj.uploadObjects, uploadIndex, uploadObj.deferred, uploadObj.photoObj.galleryId, uploadObj.errors).then(onPhotoUploadDone);
    } else {
      uploadObj.deferred.resolve();
      messageService.addProgressResult((uploadObj.uploadObjects.length - Object.keys(uploadObj.errors).length) + ' photos uploaded');
      messageService.endProgressMessage();
    }

  }

  function uploadGalleryPhotos() {
    var
      deferred = $q.defer(),
      galleryId = appDataService.getActiveGalleryId(),
      photoObjects = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(galleryId)),
      uploadIndex = 0;

    // if there are new photos
    if (photoObjects.length) {
      // All images will be uploaded one after another by recursive calls.
      // Sequential images upload makes it easier to display progress status feedback, handle errors and is a workaround
      // for strange Angular view update issue. Hope it will not be too slow compared to parallel upload.
      uploadPhoto(photoObjects, uploadIndex, deferred, galleryId).then(onPhotoUploadDone);
    } else {
      // nothing to do here
      deferred.resolve();
    }

    return deferred.promise;
  }


  function uploadGallery() {
    var
      galleryData = appDataService.getGallery();

    messageService.startProgressMessage({
      title: 'Uploading gallery'
    });

    serverAPI.createGallery(galleryData)
      .then(function (apiResult) {
        $log.info('success: created remote gallery', galleryData);
        appDataService.resetGalleryData(apiResult.data);
      })
      .then(uploadGalleryPhotos)
      .then(function () {
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
      })
      .catch(function (e) {
        throw new Error("upload gallery", e);
      });
  }

  function uploadGallerySettings (galleryId, gallerySettings) {
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