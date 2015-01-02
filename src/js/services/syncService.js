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
        remoteGallery = apiResult.data,
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

      return $q.when(comparisonObj);
    }

    function onRemovePhotoSuccess(uploadObject) {
      uploadObject.batchObject.onSuccess();
      appDataService.removePhoto(uploadObject.photoObj.id);
    }

    function onRemovePhotoError(error, uploadObject) {
      uploadObject.batchObject.onError(error);
    }


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
        serverAPI.removePhoto(uploadObject.photoObj.id, uploadObject.galleryId)
          .then(function () {
            return storageService.deleteImageVariants(uploadObject);
          })
          .then(function () {
            return appDataService.incrSyncId();
          })
          .then(function () {
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
        messageService.updateProgressMessage({title: 'Delete photos', 'batchObject': batchObject});
        for (i = 0; i < deletedPhotos.length; i++) {
          removePhotoOnRemoteAndLocally(batchObject, galleryId);
        }
      } else {
        //nothing to do here
        deferred.resolve();
      }

      batchObject.deferred.promise.then(function () {
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function removeRemotelyDeletedPhotos(comparisonObj) {
      var
        deferred = $q.defer(),
        promises = [],
        deletedPhotos = comparisonObj.local;

      angular.forEach(deletedPhotos, function (photoObj) {
        promises.push(storageService.deleteImageVariantsById(photoObj.id));
      });

      $q.all(promises).then(function(){
        deferred.resolve(comparisonObj);
      }, deferred.reject);

      return deferred;
    }

    function updatePhotoStatusToUploaded(photoObj) {
      var
        deferred = $q.defer();

      storageService.renameImageVariants(photoObj.localId, photoObj.id)
        .then(function () {
          console.log('444', photoObj);
          appDataService.resetPhotoDataAfterUpload(photoObj);
          deferred.resolve();
        })
        .catch(function (error) {
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function checkForBrokenUploads(comparisonObj) {
      var
        deferred = $q.defer(),
        promises = [],
        notUploadedPhotos = $filter('notUploadedPhotosFilter')(appDataService.getPhotos(comparisonObj.galleryId));

      angular.forEach(comparisonObj.remote, function (photoObj, photoObjKey) {
        // Double check if photo was not uploaded by this user and this client already and just not marked as uploaded.
        // This can happen in case of broken uploads where the server answer does not get back to the client.
        if (_.find(notUploadedPhotos, {'id': photoObj.localId})) {
          promises.push(updatePhotoStatusToUploaded(photoObj));
          console.log('photoObjKey', photoObjKey);
          delete comparisonObj.remote[photoObjKey];
        }
      });

      $q.all(promises).then(function () {
        deferred.resolve(comparisonObj);
      });

      return deferred.promise;
    }

    function importNewPhotos(comparisonObj) {
      var
        newPhotos = [];
      // put photo objects into an array for easier handling
      angular.forEach(comparisonObj.remote, function (photoObj) {
        newPhotos.push(photoObj)
      });

      if (newPhotos.length) {
        return remoteImageImportService.importRemoteImages(newPhotos, comparisonObj.galleryId);
      } else {
        return $q.when(comparisonObj);
      }
    }

    function setSyncId(apiResult) {
      appDataService.setSyncId(apiResult.data.syncId);

      return apiResult;
    }

    function setGallerySettings(apiResult) {
      appDataService.setGallerySettings(apiResult.data.settings);

      return apiResult;
    }

    function getRemoteUpdatesForGallery(galleryId) {
      var
        localGallery = appDataService.getGallery(galleryId);

      return serverAPI.getGalleryById(localGallery.galleryId)
        .then(setSyncId)
        .then(setGallerySettings)
        .then(compareGalleries)
        .then(removeRemotelyDeletedPhotos)
        .then(checkForBrokenUploads)
        .then(importNewPhotos)
    }

    function getAllRemoteUpdates() {
      var
        promises = [],
        localGalleries = appDataService.getGalleries();

      angular.forEach(localGalleries, function (localGallery) {
        promises.push(getRemoteUpdatesForGallery(localGallery.galleryId));
      });

      return $q.all(promises);
    }

    function checkForRemoteChanges(galleryId) {
      var
        deferred = $q.defer();

      serverAPI.getGalleryStatus(galleryId)
        .then(function (apiResult) {
          if (appDataService.getSyncId(galleryId) !== apiResult.data.syncId) {
            messageService.startProgressMessage({title: 'Syncing ...'});
            getRemoteUpdatesForGallery(galleryId)
              .then(function () {
                messageService.endProgressMessage();
                eventService.broadcast('GALLERY-UPDATE');
                deferred.resolve();
              }, function (err) {
                throw new Error('getting remote updates', err);
                //todo: show error message to user
                messageService.endProgressMessage();
                deferred.reject();
              });
          } else {
            deferred.resolve();
          }
        });

      return deferred.promise;
    }

    function uploadLocalChanges() {
      if (authService.hasUploadPermission()) {
        messageService.startProgressMessage({title: 'Uploading photos'});
        exportService.uploadGalleryPhotos()
          .then(removeLocallyDeletedPhotos)
          .then(function () {
            // on success
            messageService.endProgressMessage();
            eventService.broadcast('GALLERY-UPDATE');
          }, function (error) {
            // on error
            if (error.message === 'cancel batch') {
              messageService.updateProgressMessage({content: 'cancelling ...'});
              messageService.endProgressMessage();
            } else {
              throw error;
            }
            eventService.broadcast('GALLERY-UPDATE');
          });
      }
      else {
        $rootScope.go('upload-auth', 'slide-left');
      }
    }

    return {
      getRemoteUpdatesForGallery: getRemoteUpdatesForGallery,
      getAllRemoteUpdates: getAllRemoteUpdates,
      checkForRemoteChanges: checkForRemoteChanges,
      uploadLocalChanges: uploadLocalChanges,
      removeLocallyDeletedPhotos: removeLocallyDeletedPhotos
    }

  }
)
;