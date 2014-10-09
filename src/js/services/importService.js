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
                                                              messageService,
                                                              eventService) {




  function updateImportStatus(importObj) {
    var messageData = {
      content: importObj.photoObj.name,
      totalLength: importObj.importObjects.length,
      progressIndex: importObj.importObjectIndex + 1
    };
    messageService.updateProgressMessage(messageData, {'incr': true});
  }

  function onImportError(importError) {
    console.log("import error: ", importError);
  }

  function createLocalImportObj(importObjects, importIndex, deferred, errors) {
    return {
      'importObjects': importObjects,
      'importObjectIndex': importIndex,
      'deferred': deferred,
      'errors': errors || {},
      'photoObj': {
        'file': importObjects[importIndex],
        'id': appDataService.createPhotoId(),
        'name': importObjects[importIndex].name,
        'ownerId': appDataService.getUserId()
      }
    };
  }

  function createRemoteImportObj(importObjects, importIndex, deferred, galleryId, errors) {
    return {
      'importObjects': importObjects,
      'importObjectIndex': importIndex,
      'deferred': deferred,
      'galleryId': galleryId,
      'errors': errors || {},
      'photoObj': importObjects[importIndex]
    };
  }

  function showImportResult(importObj){
    messageService.addProgressResult((importObj.importObjects.length - Object.keys(importObj.errors).length) + ' photos added');
  }

  function onLocalImportDone(importObj) {
    var importObjectIndex;

    if (importObj.errors && importObj.errors[importObj.importObjectIndex]) {
      onImportError(importObj.errors[importObj.importObjectIndex]);
    } else {
      appDataService.addPhotoToGallery(importObj.photoObj);
    }

    importObjectIndex = importObj.importObjectIndex + 1;

    if (importObjectIndex < importObj.importObjects.length) {
      // import next photo
      importLocalImage(importObj.importObjects, importObjectIndex, importObj.deferred, importObj.errors).then(onLocalImportDone);
    } else {
      // no more photos to import
      showImportResult(importObj);
      importObj.deferred.resolve();
    }
  }

  function onRemoteImportDone(importObj) {
    var importObjectIndex;

    if (importObj.errors && importObj.errors[importObj.importObjectIndex]) {
      onImportError(importObj.errors[importObj.importObjectIndex]);
    } else {
      appDataService.addPhotoToGallery(importObj.photoObj);
    }

    importObjectIndex = importObj.importObjectIndex + 1;

    if (importObjectIndex < importObj.importObjects.length) {
      // import next photo
      importRemoteImage(importObj.importObjects, importObjectIndex, importObj.deferred, importObj.errors).then(onRemoteImportDone);
    } else {
      // no more photos to import
      showImportResult(importObj);
      importObj.deferred.resolve();
    }
  }

  function importLocalImage(fileObjects, fileObjectIndex, deferred, errors) {
    var importObj = createLocalImportObj(fileObjects, fileObjectIndex, deferred, errors);

    updateImportStatus(importObj);

    return fileReaderService.getImageAsDataURL(importObj)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .catch(function (error) {
        // if first error then create error property
        if (!importObj.errors) {
          importObj.errors = {};
        }
        // add error to error property of import object
        importObj.errors[importObj.importObjectIndex] = error;
        return $q.when(importObj);
      });
  }

  function importRemoteImage(photoObjects, photoObjectIndex, deferred, galleryId, errors) {
    var importObj = createRemoteImportObj(photoObjects, photoObjectIndex, deferred, galleryId, errors);

    updateImportStatus(importObj);

    return imageVariantsService.createVariants(importObj)
      .then(storageService.saveImageVariants)
      .catch(function (error) {
        // if first error then create error property
        if (!importObj.errors) {
          importObj.errors = {};
        }
        // add error to error property of import object
        importObj.errors[importObj.importObjectIndex] = error;
        return $q.when(importObj);
      });
  }

  function importLocalImages(fileObjects) {
    var
      deferred = $q.defer(),
      importObjectIndex = 0;

    // recursion through promise success handler (onImportDone)
    importLocalImage(fileObjects, importObjectIndex, deferred).then(onLocalImportDone);

    return deferred.promise;
  }

  function importRemoteImages(photoObjects, galleryId) {
    var
      deferred = $q.defer(),
      importObjectIndex = 0;

    if (photoObjects.length) {
      // All images will be imported one after another by recursive calls to importRemoteImage() function
      // from it´s success handler onRemoteImportDone().
      // Sequential images import makes it easier to display progress status feedback and is a workaround for
      // strange Angular view update issue. Hope it will not be to slow compared to parallel import.
      importRemoteImage(photoObjects, importObjectIndex, deferred, galleryId).then(onRemoteImportDone);
    } else {
      // nothing to import
      deferred.resolve();
    }

    return deferred.promise;
  }


  return {
    importLocalImages: importLocalImages,
    importRemoteImages: importRemoteImages
  }

});