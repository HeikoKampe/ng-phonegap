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

    // signed urls on initial gallery import are already provided by the server
    if (importObj.photoObj.url) {
      deferred.resolve(importObj)
    } else {
      serverAPI.getSignedImageUrl(importObj.galleryId, importObj.photoObj.id).then(function (result) {
        importObj.photoObj.url = result.data.signedUrl;
        deferred.resolve(importObj);
      }, function (err) {
        throw new Error('could not get signed url for image');
      });
    }

    return deferred.promise;
  }


  function onLocalImportDone(importObj) {
    appDataService.addPhotoToGallery(importObj.photoObj);
    importObj.status.successes++;
    if (importObj.importStack.length) {
      // import next in stack
      importLocalImage(importObj);
    } else {
      // all imports are done
      showImportResult(importObj.status);
      importObj.deferred.resolve(importObj);
    }
  }

  function importLocalImage(importObject) {
    var
      fileObject = importObject.importStack.pop();

    importObject.photoObj = {
      file: fileObject,
      id: appDataService.createPhotoId(),
      name: fileObject.name,
      ownerId: appDataService.getUserId()
    };

    updateStatusMessage(importObject);

    fileReaderService.getImageAsDataURL(importObject)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .then(onLocalImportDone)
      .catch(function (error) {
        // add error to error property of import object
        importObject.errors.push(error);
        importObject.status.failures++;
        throw new Error(error);
      });
  }

  function importLocalImages(fileObjects) {
    var
      deferred = $q.defer(),
      importObject = {
        importStack: [],
        errors: [],
        status: {
          nImports: fileObjects.length,
          importIndex: 1,
          failures: 0,
          successes: 0
        },
        deferred: deferred
      };

    angular.forEach(fileObjects, function (fileObj) {
      importObject.importStack.push(fileObj);
    });

    importLocalImage(importObject);

    return deferred.promise;
  }


  function onImportRemoteImageSuccess(importObject) {
    appDataService.addPhotoToGallery(importObject.photoObj, importObject.galleryId);
    importObject.status.successes++;
    updateStatusMessage(importObject);
    importObject.deferred.resolve(importObject);
  }

  function onImportRemoteImageError(error, importObject){
    // add error to error property of import object
    importObject.errors.push(error);
    importObject.status.failures++;
    updateStatusMessage(importObject);
    importObject.deferred.resolve(importObject);
    throw new Error(error);
  }

  function importRemoteImage(importObject) {
    getSignedUrl(importObject)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .then(onImportRemoteImageSuccess)
      .catch(function (error) {
        onImportRemoteImageError(error, importObject)
      });

    return importObject.deferred.promise;
  }

  function importRemoteImages(photoObjects, galleryId) {
    var
      deferred = $q.defer(),
      promises = [],
      errors = [],
      status = {
        nImports: photoObjects.length,
        importIndex: 1,
        failures: 0,
        successes: 0
      };

    angular.forEach(photoObjects, function (photoObj) {
      var importObject = {
        'photoObj': photoObj,
        'galleryId': galleryId,
        'deferred': $q.defer(),
        'errors': errors,
        'status': status
      };
      // mark photo as not viewed
      importObject.photoObj.viewStatus = 0;
      promises.push(importRemoteImage(importObject));
    });

    $q.all(promises).then(function (resolvedPromises) {
      showImportResult(status);
      deferred.resolve();
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
    var
      deferred = $q.defer();

    serverAPI.getGallery(ownerName, galleryKey).then(function (result) {
      console.log("received gallery from API:", result);
      appDataService.addGallery(result.data);
      messageService.startProgressMessage({title: 'Importing gallery'});
      importService.importRemoteImages(result.data.photos).then(function () {
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
        deferred.resolve();
      });
    });

    return deferred.promise;
  }

  return {
    importLocalImages: importLocalImages,
    importRemoteImages: importRemoteImages,
    importGalleryByUsernameAndKey: importGalleryByUsernameAndKey,
    importGalleriesOfOwner: importGalleriesOfOwner
  }

});