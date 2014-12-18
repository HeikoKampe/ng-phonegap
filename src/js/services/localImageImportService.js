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
                                                                        messageService) {


  function onImportLocalImageSuccess(importObject) {
    $rootScope.$evalAsync(function () {
      console.log('import success: ', importObject.batchObject);
      appDataService.addPhotoToGallery(importObject.photoObj);
      importObject.batchObject.successes++;
      importObject.batchObject.progress++;
      // all imports done?
      if (importObject.batchObject.nImports === importObject.batchObject.progress) {
        importObject.batchObject.deferredAll.resolve(importObject.batchObject);
        messageService.endProgressMessage();
      } else {
        // import next in stack
        importLocalImage(importObject);
      }
    });
  }

  function onImportLocalImageError(error, importObject) {

    if (error.message !== 'abort') {
      throw error;
    }

    console.log('import error: ', importObject.batchObject);
    $rootScope.$evalAsync(function () {
      importObject.batchObject.failures++;
      importObject.batchObject.progress++;
      // all imports done?
      if (importObject.batchObject.nImports === importObject.batchObject.progress) {
        importObject.batchObject.deferredAll.resolve(importObject.batchObject);
        messageService.endProgressMessage();
      } else {
        // import next in stack
        importLocalImage(importObject);
      }

    });
  }


  function importLocalImage(importObject) {
    var
      fileObject = importObject.batchObject.fileObjects.pop();

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
      batchObject = {
        fileObjects: [],
        deferredAll: $q.defer(),
        nImports: fileObjects.length,
        progress: 0,
        failures: 0,
        successes: 0,

        isCancelled: false,
        cancel: function () {
          this.isCancelled = true;
        }
      },
      importObject = {
        'batchObject': batchObject
      };

    // push each file objects into an array for easier handling
    angular.forEach(fileObjects, function (fileObj) {
      batchObject.fileObjects.push(fileObj);
    });

    messageService.startProgressMessage({title: 'Importing photos', 'batchObject': batchObject});

    // importLocalImage will recursive import all objects on the importStack
    // start import by calling importLocalImage the first time
    importLocalImage(importObject);

    return batchObject.deferredAll.promise;
  }

  return {
    importLocalImages: importLocalImages
  }


});