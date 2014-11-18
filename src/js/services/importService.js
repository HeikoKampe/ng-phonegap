'use strict';

angular.module(_SERVICES_).service('importService', function ($rootScope, $q, $log, $timeout, serverAPI, fileReaderService, appDataService, imageVariantsService, storageService, messageService) {


  function updateStatusMessage(importObj) {
    var messageData = {
      content: importObj.photoObj.name,
      totalLength: importObj.status.nImports,
      progressIndex: importObj.status.importIndex++
    };
    messageService.updateProgressMessage(messageData);
  }


  function showImportResult(importObj) {
    messageService.addProgressResult(importObj.status.successes + ' of ' + importObj.status.nImports + 'photos were added');
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
    importObj.status.successes ++;
    if (importObj.importStack.length) {
      // import next in stack
      importLocalImage(importObj);
    } else {
      // all imports are done
      showImportResult(importObj);
      importObj.deferred.resolve(importObj);
    }
  }

  function onRemoteImportDone(importObj) {
    appDataService.addPhotoToGallery(importObj.photoObj);
    importObj.status.successes ++;
    if (importObj.importStack.length) {
      // import next in stack
      importRemoteImage(importObj);
    } else {
      // all imports are done
      showImportResult(importObj);
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
        importObject.status.failures ++;
        throw new Error(error);
      });
  }

  function importRemoteImage(importObject) {
    importObject.photoObj = importObject.importStack.pop();
    //mark photo as newly imported and not viewed yet
    importObject.photoObj.viewStatus = 0;

    updateStatusMessage(importObject);

    getSignedUrl(importObject)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .then(onRemoteImportDone)
      .catch(function (error) {
        // add error to error property of import object
        importObject.errors.push(error);
        importObject.status.failures ++;
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

  function importRemoteImages(photoObjects, galleryId) {
    var
      deferred = $q.defer(),
      importObject = {
        galleryId: galleryId,
        importStack: photoObjects,
        errors: [],
        status: {
          nImports: photoObjects.length,
          importIndex: 1,
          failures: 0,
          successes: 0
        },
        deferred: deferred
      };

    importRemoteImage(importObject);

    return deferred.promise;
  }

  return {
    importLocalImages: importLocalImages,
    importRemoteImages: importRemoteImages
  }

});