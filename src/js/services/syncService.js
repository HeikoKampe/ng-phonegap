'use strict';

angular.module(_SERVICES_).factory('syncService', function ($rootScope,
                                                            $filter,
                                                            $log,
                                                            $q,
                                                            serverAPI,
                                                            appDataService,
                                                            importService,
                                                            storageService,
                                                            eventService,
                                                            authService,
                                                            exportService,
                                                            messageService) {

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
        // remove objects with same keys/ids
        if (comparisonObj.local[remotePhotoKey]) {
          delete comparisonObj.local[remotePhotoKey];
          delete comparisonObj.remote[remotePhotoKey];
        }
      });

      return $q.when(comparisonObj);
    }

    function removeDeletedPhotos(comparisonObj) {
      var
        deletedPhotos = comparisonObj.local,
        nDeletedPhotos = 0;
      angular.forEach(deletedPhotos, function (photoObj, photoId) {
        storageService.removePhoto(photoId);
        appDataService.removePhoto(photoId);
        nDeletedPhotos ++;
      });
      if (nDeletedPhotos) {
        messageService.addProgressResult(nDeletedPhotos + ' photos deleted');
      }
      return comparisonObj;
    }

    function importNewPhotos(comparisonObj) {
      var newPhotos = [];
      // put photo objects into an array for easier handling
      angular.forEach(comparisonObj.remote, function (photoObj) {
        newPhotos.push(photoObj)
      });
      return importService.importRemoteImages(newPhotos, comparisonObj.galleryId);
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
        .then(removeDeletedPhotos)
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
      serverAPI.getGalleryStatus(galleryId)
        .then(function (apiResult) {
          if (appDataService.getSyncId(galleryId) !== apiResult.data.syncId) {
            messageService.startProgressMessage({title: 'Syncing ...'});
            getRemoteUpdatesForGallery(galleryId)
              .then(function () {
                messageService.endProgressMessage();
                eventService.broadcast('GALLERY-UPDATE');
              });
          }
        });
    }

    function onUploadStart() {
      var messageData = {
        title: 'Syncing ...'
      };

      messageService.startProgressMessage(messageData);
    }


    function uploadLocalChanges() {

      if (authService.hasUploadPermission()) {
        onUploadStart();
        exportService.uploadGalleryPhotos()
          .then(exportService.removeDeletedGalleryPhotos)
          .then(messageService.endProgressMessage)
          .then(function () {
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
      uploadLocalChanges: uploadLocalChanges
    }

  }
)
;