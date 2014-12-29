'use strict';

angular.module(_SERVICES_).service('galleryImportService', function (
                                                              $q,
                                                              $log,
                                                              serverAPI,
                                                              appDataService,
                                                              storageService,
                                                              eventService,
                                                              messageService,
                                                              batchFactoryService,
                                                              remoteImageImportService) {

  function rollbackImportGallery(galleryObj) {
    var i;

    appDataService.deleteGallery(galleryObj._id);
    for (i = 0; i < galleryObj.photos.length; i++) {
      storageService.removePhotos(galleryObj.photos);
    }
    eventService.broadcast('GALLERY-UPDATE');
  }

  function importGallery(apiResult) {
    var
      deferred = $q.defer(),
      galleryObj = apiResult;

    appDataService.addGallery(galleryObj);

    remoteImageImportService.importRemoteImages(galleryObj.photos, galleryObj._id)
      .then(function () {
        deferred.resolve();
      }, function (error) {
        rollbackImportGallery(galleryObj);
        deferred.reject(error);
      });

    return deferred.promise;
  }

  function importGalleryByUsernameAndKey(ownerName, galleryKey) {
    var
      deferred = $q.defer();

    messageService.startProgressMessage({title: 'Importing foreign gallery'});

    serverAPI.getGallery(ownerName, galleryKey)
      .then(importGallery)
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
        console.log('importGalleryByUsernameAndKey', error);
      });

    return deferred.promise;
  }

  function rollBackBatchImportOfGalleries(batchObject) {
    var
      i;

    for (i = 0; i <= batchObject.stackIndex; i++) {
      appDataService.deleteGallery(batchObject.batchStack[i]._id);
      storageService.removePhotos(batchObject.batchStack[i].photos);
    }
    eventService.broadcast('GALLERY-UPDATE');
  }

  function onGalleryImportSuccess(batchObject) {
    batchObject.onSuccess();
    // all imports done?
    if (batchObject.hasNext()) {
      // import next in stack
      galleryBatchImport(batchObject);
    }
  }

  function onGalleryImportError(error, batchObject) {
    batchObject.onError(error);
    // all imports done?
    if (batchObject.hasNext()) {
      // import next in stack
      galleryBatchImport(batchObject);
    }
  }

  function galleryBatchImport(batchObject) {
    var
      importObject = {
        'batchObject': batchObject,
        'galleryObject': batchObject.getNext()
      };

    appDataService.addGallery(importObject.galleryObject);

    remoteImageImportService.importRemoteImages(importObject.galleryObject.photos, importObject.galleryObject._id, importObject.batchObject.cancelObject)
      .then(function () {
        onGalleryImportSuccess(batchObject)
      }, function (error) {
        onGalleryImportError(error, batchObject)
      });
  }

  function batchImportOfGalleries(galleriesArray) {
    var
      deferred = $q.defer(),
      batchObject;

    batchObject = batchFactoryService.createBatchObject(galleriesArray, {isCancelled: false});

    messageService.startProgressMessage({title: 'Importing users galleries'});

    // start serial import of galleries
    galleryBatchImport(batchObject);

    batchObject.deferred.promise.then(function () {
      messageService.endProgressMessage();
      eventService.broadcast('GALLERY-UPDATE');
      deferred.resolve();
    }, function (error) {
      messageService.endProgressMessage();
      console.log('batchImportOfGalleries error: ', batchObject);
      rollBackBatchImportOfGalleries(batchObject);
      deferred.reject(error);
    });

    return deferred.promise;
  }

  function importAllGalleriesOfUser(userId) {
    var
      deferred = $q.defer();

    serverAPI.getGalleriesOfOwner(userId)
      .then(batchImportOfGalleries)
      .then(function () {
        deferred.resolve();
      }, function (error) {
        console.log('importAllGalleriesOfUser', error);
      });

    return deferred.promise;
  }

  return {
    importGalleryByUsernameAndKey: importGalleryByUsernameAndKey,
    importAllGalleriesOfUser: importAllGalleriesOfUser
  }

});