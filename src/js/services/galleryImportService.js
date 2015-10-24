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
      storageService.deleteImageVariantsById(galleryObj.photos[i].id);
    }
    eventService.broadcast('GALLERY-UPDATE');
  }

  function importGallery(apiResult, accessToken) {
    var
      deferred = $q.defer(),
      galleryObj = apiResult;

    appDataService.addGallery(galleryObj);
    appDataService.setGalleryToken(accessToken, galleryObj.galleryId);

    remoteImageImportService.importRemoteImages(galleryObj.photos, galleryObj._id)
      .then(deferred.resolve, function (error) {
        rollbackImportGallery(galleryObj);
        deferred.reject(error);
      });

    return deferred.promise;
  }

  function importForeignGallery(galleryId, accessToken) {
    var
      deferred = $q.defer();

    serverAPI.getGalleryById(galleryId, accessToken)
      .then(function (apiResult){
        messageService.startProgressMessage({title: 'Importing foreign gallery'});
        return importGallery(apiResult, accessToken);
      })
      .then(deferred.resolve, function (error) {
        // on error
        if (error.message === 'cancel batch') {
          messageService.updateProgressMessage({content: 'cancelling ...'});
        }
        deferred.reject(error);
        console.log('importGalleryByUsernameAndKey', error);
      })
      .finally(function(){
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
      });

    return deferred.promise;
  }

  function rollBackBatchImportOfGalleries(batchObject) {
    var
      i,m;

    for (i = 0; i <= batchObject.stackIndex; i++) {
      appDataService.deleteGallery(batchObject.batchStack[i]._id);
      for (m = 0; m < batchObject.batchStack[i].photos.length; m++) {
        storageService.deleteImageVariantsById(batchObject.batchStack[i].photos[m].id);
      }
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
      batchCancelObj = {
        isCancelled: false,
        deferredHttpTimeout: $q.defer()
      },
      batchObject = batchFactoryService.createBatchObject(galleriesArray, batchCancelObj);

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


  function importAllForeignGalleries () {
    var
        deferred = $q.defer();


    // todo: this needs to be implemented
    serverAPI.getSubscribedGalleriesOfOwner(userId)
        .then(batchImportOfGalleries)
        .then(function () {
          deferred.resolve();
        }, function (error) {
          console.log('importAllForeignGalleriesOfUser', error);
        });

    return deferred.promise;
  }

  return {
    importForeignGallery: importForeignGallery,
    //importAllForeignGallery: importAllForeignGallery,
    importAllGalleriesOfUser: importAllGalleriesOfUser
  }

});