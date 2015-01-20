'use strict';

angular.module(_SERVICES_).factory('syncService', function ($rootScope,
                                                            $filter,
                                                            $log,
                                                            $q,
                                                            serverAPI,
                                                            appDataService,
                                                            remoteImageImportService,
                                                            storageService,
                                                            eventService,
                                                            authService,
                                                            exportService,
                                                            messageService,
                                                            batchFactoryService) {

  var batchCancelObj = {};

  function createComparisonObj(photos) {
    var i, comparisonObj = {};

    for (i = 0; i < photos.length; i++) {
      // compare only uploaded photos
      if (photos[i].dateOfUpload) {
        comparisonObj[photos[i].id] = photos[i];
      }
    }

    return comparisonObj;
  }

  function compareGalleries(apiResult) {
    var
      remoteGallery = apiResult,
      localGalleryPhotos = appDataService.getPhotos(remoteGallery._id),
      comparisonObj = {
        galleryId: remoteGallery._id
      };

    comparisonObj.local = createComparisonObj(localGalleryPhotos);
    comparisonObj.remote = createComparisonObj(remoteGallery.photos);

    angular.forEach(comparisonObj.remote, function (remotePhoto, remotePhotoKey) {
      // remove objects with same keys/ids (objects which are in sync)
      if (comparisonObj.local[remotePhotoKey]) {
        delete comparisonObj.local[remotePhotoKey];
        delete comparisonObj.remote[remotePhotoKey];
      }
    });

    return {
      'apiResult': apiResult,
      'comparisonObj': comparisonObj
    };
  }

  function onRemovePhotoSuccess(uploadObject) {
    uploadObject.batchObject.onSuccess();
    appDataService.removePhoto(uploadObject.photoObj.id);
  }

  function onRemovePhotoError(error, uploadObject) {
    uploadObject.batchObject.onError(error);
  }

  // when photo was deleted locally
  function removePhotoOnRemoteAndLocally(batchObject, galleryId) {
    var
    // create an photo upload object with a reference to the batch object
    // the reference is needed as a handle for cancelling the batch operation (cancel all batch jobs)
      uploadObject = {
        'batchObject': batchObject,
        'photoObj': batchObject.getNext(),
        'galleryId': galleryId
      };

    if (uploadObject.photoObj.dateOfUpload) {
      // delete from remote server and locally
      serverAPI.removePhoto(uploadObject.photoObj.id, uploadObject.galleryId, {timeout: uploadObject.batchObject.deferredHttpTimeout.promise})
        .then(function (apiResult) {
          uploadObject.apiResult = apiResult;
          return storageService.deleteImageVariants(uploadObject);
        })
        .then(function () {
          // Careful! Only increment syncId if the photo was uploaded
          appDataService.setSyncId(uploadObject.apiResult.syncId, uploadObject.galleryId);
          onRemovePhotoSuccess(uploadObject);
        })
        .catch(function (error) {
          onRemovePhotoError(error, uploadObject)
        });

    } else {
      // only delete locally
      storageService.deleteImageVariants(uploadObject)
        .then(function () {
          onRemovePhotoSuccess(uploadObject);
        })
        .catch(function (error) {
          onRemovePhotoError(error, uploadObject)
        });
    }
  }

  function removeLocallyDeletedPhotos() {
    var
      i,
      deferred = $q.defer(),
      galleryId = appDataService.getActiveGalleryId(),
      deletedPhotos = $filter('photoFilter')(appDataService.getPhotos(), 'deleted', true),
      batchObject = batchFactoryService.createBatchObject(deletedPhotos, {isCancelled: false});

    if (deletedPhotos.length) {
      messageService.updateProgressMessage({'prefix': 'Deleting photos ...', 'batchObject': batchObject});
      for (i = 0; i < deletedPhotos.length; i++) {
        removePhotoOnRemoteAndLocally(batchObject, galleryId);
      }
    } else {
      //nothing to do here
      deferred.resolve();
    }

    batchObject.deferred.promise.then(function () {
      eventService.broadcast('GALLERY-UPDATE');
      deferred.resolve();
    }, function (error) {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  // when photo was removed remotely
  function removePhotoLocally(batchObject, galleryId) {
    var
      photoObj = batchObject.getNext();

    storageService.deleteImageVariantsById(photoObj.id)
      .then(function () {
        console.log('removePhoto', photoObj.id);
        appDataService.removePhoto(photoObj.id, galleryId);
        batchObject.onSuccess();
      })
      .catch(function (error) {
        batchObject.onError(error);
      });
  }

  function removeRemotelyDeletedPhotos(data) {
    var
      deferred = $q.defer(),
      batchObject;

    if (_.size(data.comparisonObj.local)) {
      batchCancelObj.isCancelled = batchCancelObj.isCancelled || false;
      batchObject = batchFactoryService.createBatchObject(data.comparisonObj.local, batchCancelObj);
      messageService.updateProgressMessage({'prefix': 'Deleting photos ...', 'batchObject': batchObject});
      angular.forEach(data.comparisonObj.local, function () {
        removePhotoLocally(batchObject, data.comparisonObj.galleryId);
      });
      batchObject.deferred.promise.then(function () {
        deferred.resolve(data);
      }, function (error) {
        deferred.reject(error);
      });
    } else {
      //nothing to do here
      deferred.resolve(data);
    }

    return deferred.promise;
  }

  function  updatePhotoStatusToUploaded(photoObj) {
    var
      deferred = $q.defer();

    storageService.renameImageVariants(photoObj.localId, photoObj.id)
      .then(function () {
        appDataService.resetPhotoDataAfterUpload(photoObj);

        deferred.resolve();
      })
      .catch(function (error) {
        deferred.reject(error);
      });

    return deferred.promise;
  }

  function checkForBrokenUploads(data) {
    var
      deferred = $q.defer(),
      promises = [],
      notUploadedPhotos = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(data.comparisonObj.galleryId));

    angular.forEach(data.comparisonObj.remote, function (photoObj, photoObjKey) {
      // Double check if photo was already uploaded by this user and this client  and just not marked as uploaded.
      // This can happen in case of broken uploads where the server answer does not get back to the client.
      if (_.find(notUploadedPhotos, {'id': photoObj.localId})) {
        promises.push(updatePhotoStatusToUploaded(photoObj));
        delete data.comparisonObj.remote[photoObjKey];
      }
    });

    $q.all(promises).then(function () {
      deferred.resolve(data);
    });

    return deferred.promise;
  }

  function importNewPhotos(data) {
    var
      deferred = $q.defer(),
      newPhotos = [];

    // put photo objects into an array for easier handling
    angular.forEach(data.comparisonObj.remote, function (photoObj) {
      newPhotos.push(photoObj)
    });

    if (newPhotos.length) {
      remoteImageImportService.importRemoteImages(newPhotos, data.comparisonObj.galleryId, batchCancelObj)
        .then(function(){
          deferred.resolve(data)
        });
    } else {
      deferred.resolve(data);
    }

    return deferred.promise;
  }

  function compareGallerySettings(apiResult) {
    // update local gallery settings in case the have changed remotely
    if (! _.isEqual(apiResult.settings, appDataService.getGallerySettings(apiResult._id))){
      appDataService.setGallerySettings(apiResult.settings);
    }

    return apiResult;
  }

  // updateSyncId needs to be at the end of the "get remote updates" promise chain
  // to be only called if there were no errors in the chain
  function updateSyncId (data) {
    appDataService.setSyncId(data.apiResult.syncId, data.apiResult._id);
  }

  function getRemoteUpdatesForGallery(galleryId) {
    var
      localGallery = appDataService.getGallery(galleryId);

    return serverAPI.getGalleryById(localGallery.galleryId)
      .then(compareGallerySettings)
      .then(compareGalleries)
      .then(removeRemotelyDeletedPhotos)
      .then(checkForBrokenUploads)
      .then(importNewPhotos)
      .then(updateSyncId)
  }

  function checkForRemoteChangesOfGallery(galleryObj) {
    var
      deferred = $q.defer();

    if (galleryObj.dateOfUpload) {
      serverAPI.getGalleryStatus(galleryObj.galleryId)
        .then(function (apiResult) {
          console.log('locale syncId: ', appDataService.getSyncId(galleryObj.galleryId), '/', apiResult.data.syncId);
          if (appDataService.getSyncId(galleryObj.galleryId) !== apiResult.data.syncId) {
            messageService.updateProgressMessage({
              title: 'Syncing album',
              subtitle: appDataService.getGalleryTitle(galleryObj.galleryId)
            });
            getRemoteUpdatesForGallery(galleryObj.galleryId)
              .then(deferred.resolve, deferred.reject)
          } else {
            deferred.resolve();
          }
        });
    } else {
      deferred.resolve();
    }

    return deferred.promise;
  }

  function batchCheckForRemoteChangesOfGallery(batchObject) {
    var
      galleryObj = batchObject.getNext();

    checkForRemoteChangesOfGallery(galleryObj)
      .then(function () {
        batchObject.onSuccess();
        if (batchObject.hasNext()) {
          batchCheckForRemoteChangesOfGallery(batchObject);
        }
      }, function (error) {
        batchObject.onError(error);
        if (batchObject.hasNext()) {
          batchCheckForRemoteChangesOfGallery(batchObject);
        }
      })
  }

  function checkForRemoteChanges() {
    var
      deferred = $q.defer(),
      batchObject;

    batchCancelObj.isCancelled = false;
    batchCancelObj.deferredHttpTimeout = $q.defer();

    batchCancelObj.deferredHttpTimeout.promise.then(function(){
        console.log('deferredHttpTimeout resolved!!!!!!');
      }
    );

    batchObject = batchFactoryService.createBatchObject(appDataService.getGalleries(), batchCancelObj);

    batchCheckForRemoteChangesOfGallery(batchObject);

    batchObject.deferred.promise
      .then(deferred.resolve, deferred.reject)
      .finally(function(){
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
        console.log('syncing done');
      });

    return deferred.promise;
  }

  function uploadLocalChanges() {
    if (authService.hasUploadPermission()) {
      messageService.startProgressMessage({title: 'Uploading photos'});
      exportService.uploadGalleryPhotos()
        .then(removeLocallyDeletedPhotos)
        .catch(function (error) {
          // on error
          if (error.message === 'cancel batch') {
            messageService.updateProgressMessage({suffix: 'cancelling ...'});
          } else {
            throw error;
          }
        })
        .finally(function(){
          messageService.endProgressMessage();
          eventService.broadcast('GALLERY-UPDATE');
        });
    }
    else {
      $rootScope.go('upload-auth', 'slide-left');
    }
  }

  return {
    getRemoteUpdatesForGallery: getRemoteUpdatesForGallery,
    checkForRemoteChangesOfGallery:checkForRemoteChangesOfGallery,
    checkForRemoteChanges: checkForRemoteChanges,
    uploadLocalChanges: uploadLocalChanges,
    removeLocallyDeletedPhotos: removeLocallyDeletedPhotos
  }

});