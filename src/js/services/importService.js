'use strict';

angular.module(_SERVICES_).service('importService', function ($rootScope,
                                                              $q,
                                                              $log,
                                                              $timeout,
                                                              serverAPI,
                                                              fileReaderService,
                                                              appDataService,
                                                              imageVariantsService,
                                                              storageService,
                                                              eventService,
                                                              messageService) {


  function updateStatusMessage(importObj) {
    var messageData = {
      content: importObj.photoObj.name,
      totalLength: importObj.status.nImports,
      progressIndex: importObj.status.importIndex++
    };
    messageService.updateProgressMessage(messageData);
  }

  function showImportResult(importStatusObj) {
    messageService.addProgressResult(importStatusObj.successes + ' of ' + importStatusObj.nImports + 'photos were added');
  }

  function getSignedUrl(importObj) {
    var deferred = $q.defer();

    if (importObj.batchObject && importObj.batchObject.isCancelled) {
      deferred.reject(new Error('abort'));
    }

    // signed urls on initial gallery import are already provided by the server
    if (importObj.photoObj.url) {
      deferred.resolve(importObj)
    } else {
      serverAPI.getSignedImageUrl(importObj.galleryId, importObj.photoObj.id, {timeout: importObj.batchObject.deferredHttpTimeout.promise}).then(function (result) {
        importObj.photoObj.url = result.data.signedUrl;
        deferred.resolve(importObj);
      }, function (err) {
        throw new Error('could not get signed url for image');
      });
    }

    return deferred.promise;
  }


  function onImportRemoteImageSuccess(importObject) {
    $rootScope.$evalAsync(function () {
      console.log('import success: ', importObject.batchObject);
      appDataService.addPhotoToGallery(importObject.photoObj, importObject.galleryId);
      importObject.batchObject.successes++;
      importObject.batchObject.progress++;
      // all imports done?
      if (importObject.batchObject.nImports === importObject.batchObject.progress) {
        importObject.batchObject.deferredAll.resolve(importObject.batchObject);
      }
    });
  }

  function onImportRemoteImageError(error, importObject) {

    if (error.message !== 'abort') {
      throw error;
    }

    $rootScope.$evalAsync(function () {
      importObject.batchObject.failures++;
      importObject.batchObject.progress++;
      updateStatusMessage(importObject);
      // all imports done?
      if (importObject.batchObject.nImports === importObject.batchObject.successes + importObject.batchObject.failures) {
        importObject.batchObject.deferredAll.resolve(importObject.batchObject);
      }
    });
  }

  function importRemoteImage(importObject) {
    getSignedUrl(importObject)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .then(onImportRemoteImageSuccess)
      .catch(function (error) {
        onImportRemoteImageError(error, importObject)
      });
  }

  function importRemoteImages(photoObjects, galleryId) {
    var
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
        }
      };

    if (photoObjects && photoObjects.length) {

      angular.forEach(photoObjects, function (photoObj) {
        var
          importObject = {
            'batchObject': batchObject,
            'photoObj': photoObj,
            'galleryId': galleryId
          };

        // mark photo as not viewed
        importObject.photoObj.viewStatus = 0;
        // start import of image
        importRemoteImage(importObject);
      });

    } else {
      batchObject.deferredAll.resolve();
    }

    return batchObject;
  }

  function importGallery(apiResult) {
    var
      deferred = $q.defer(),
      galleryObj = apiResult.data,
      batchImport = importRemoteImages(galleryObj.photos);

    messageService.startProgressMessage({title: 'Importing gallery', 'batchObject': batchImport});
    appDataService.addGallery(galleryObj);
    batchImport.deferredAll.promise.then(function (result) {
      messageService.endProgressMessage();
      eventService.broadcast('GALLERY-UPDATE');
      deferred.resolve(batchImport);
    }, function (err) {
      messageService.endProgressMessage();
      deferred.resolve(batchImport);
      throw new Error('gallery import failed');
    });

    return deferred.promise;
  }

  function importGalleriesOfOwner(userId) {
    var
      deferred = $q.defer(),
      promises = [];

    serverAPI.getGalleriesOfOwner(userId)
      .then(function (result) {
        messageService.startProgressMessage({title: 'Importing galleries ...'});
        angular.forEach(result.data, function (gallery) {
          appDataService.addGallery(gallery);
          promises.push(importRemoteImages(gallery.photos, gallery._id));
        });

        $q.all(promises).then(function () {
          messageService.endProgressMessage();
          deferred.resolve();
        });

      });

    return deferred.promise;
  }

  function importGalleryByUsernameAndKey(ownerName, galleryKey) {
    return serverAPI.getGallery(ownerName, galleryKey)
      .then(importGallery);
  }

  return {
    importRemoteImages: importRemoteImages,
    importGalleryByUsernameAndKey: importGalleryByUsernameAndKey,
    importGalleriesOfOwner: importGalleriesOfOwner
  }

});