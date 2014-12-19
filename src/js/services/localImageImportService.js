'use strict';

angular.module(_SERVICES_).service('localImageImportService', function ($rootScope,
                                                                        $q,
                                                                        $log,
                                                                        $timeout,
                                                                        serverAPI,
                                                                        fileReaderService,
                                                                        appDataService,
                                                                        imageVariantsService,
                                                                        storageService,
                                                                        eventService,
                                                                        messageService,
                                                                        batchFactoryService) {


  function onImportLocalImageSuccess(importObject) {
    $rootScope.$evalAsync(function () {
      importObject.batchObject.onSuccess();
      appDataService.addPhotoToGallery(importObject.photoObj);
      // all imports done?
      if (importObject.batchObject.hasNext()) {
        // import next in stack
        importLocalImage(importObject.batchObject);
      }
    });
  }

  function onImportLocalImageError(error, importObject) {
    importObject.batchObject.onError(error);
    // all imports done?
    if (importObject.batchObject.hasNext()) {
      // import next in stack
      importLocalImage(importObject.batchObject);
    }
  }

  function importLocalImage(batchObject) {
    var
      // create an import object with a reference to batch object
      importObject = {
        'batchObject': batchObject
      },
      fileObject = batchObject.getNext();

    importObject.photoObj = {
      file: fileObject,
      id: appDataService.createPhotoId(),
      name: fileObject.name,
      ownerId: appDataService.getUserId()
    };

    fileReaderService.getImageAsDataURL(importObject)
      .then(imageVariantsService.createVariants)
      .then(storageService.saveImageVariants)
      .then(onImportLocalImageSuccess)
      .catch(function (error) {
        onImportLocalImageError(error, importObject)
      });
  }

  function importLocalImages(fileObjects) {
    var
      deferred = $q.defer(),
      batchObject = batchFactoryService.createBatchObject(fileObjects);

    messageService.startProgressMessage({title: 'Importing photos', 'batchObject': batchObject});

    // importLocalImage will recursive import all objects on the importStack
    // start import by calling importLocalImage the first time
    importLocalImage(batchObject);

    batchObject.deferred.promise.then(function () {
      messageService.endProgressMessage();
      deferred.resolve();
    });

    return deferred.promise;
  }

  return {
    importLocalImages: importLocalImages
  }


});