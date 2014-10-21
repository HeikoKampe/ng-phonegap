angular.module(_SERVICES_).service('storageService', function ($rootScope, $log, $q, fileSystemAPI, eventService, appDataService) {

  'use strict';

  var
    THUMBNAILS_DIR = 'thumbnails',
    DATA_FILE = 'appData.txt'; // todo: move to settings

  function checkIfFirstRun() {
    var deferred = $q.defer();

    fileSystemAPI.checkFile(DATA_FILE).then(function (result) {
      deferred.resolve(false);
    }, function (err) {
      deferred.resolve(true);
    });

    return deferred.promise;
  }

  function restoreAppData() {
    fileSystemAPI.readFile(DATA_FILE).then(function (content) {
      appDataService.setAppData(angular.fromJson(content, true));
    }, function (e) {
      console.log("Error: restoring app data failed", e);
    });
  }

  function initStorage() {
    checkIfFirstRun().then(function (isFirstRun) {
      console.log('checkIfFirstRun', isFirstRun);
      if (isFirstRun) {
        fileSystemAPI.createDir(THUMBNAILS_DIR, true);
        saveAppData();
      } else {
      restoreAppData();
      }
    });
  }

  function saveAppData() {
    fileSystemAPI.writeFile(DATA_FILE, angular.toJson(appDataService.getAppData()), {}).then(function () {
      $log.log("app data saved", angular.toJson(appDataService.getAppData()));
    }, function (e) {
      throw new Error("saving app data", e);
    })
  }

  function saveThumbnailImage(importObj) {
    var
      deferredImportObj = $q.defer();

    fileSystemAPI.writeFile(THUMBNAILS_DIR + '/' + importObj.photoObj.id, importObj.photoObj.thumbDataURI)
      //fileSystemAPI.writeFile('xxx' +thumbnailsDirectory + importObj.photoObj.id, importObj.photoObj.thumbDataURI)
      .then(function () {
        delete importObj.photoObj.thumbDataURI;
        deferredImportObj.resolve(importObj);
      },
      function (msg) {
        delete importObj.photoObj.thumbDataURI;
        deferredImportObj.reject(msg);
      });

    return deferredImportObj.promise;
  }

  function saveMainImage(importObj) {
    var
      deferredImportObj = $q.defer();

    fileSystemAPI.writeFile(importObj.photoObj.id, importObj.photoObj.mainDataURI)
      .then(function () {
        delete importObj.photoObj.mainDataURI;
        deferredImportObj.resolve(importObj);
      },
      function (msg) {
        delete importObj.photoObj.mainDataURI;
        deferredImportObj.reject(importObj);
      });

    return deferredImportObj.promise;
  }


  function saveImageVariants(importObj) {
    return saveMainImage(importObj).then(saveThumbnailImage);
  }

  function loadImage(photoId) {
    var
      deferredImage = $q.defer();

    fileSystemAPI.readFile(photoId).then(
      function (imgDataSrc) {
        deferredImage.resolve(imgDataSrc);
      },
      function (e) {
        deferredImage.reject(new Error('unable to read file: ', e));
      }
    );
    return deferredImage.promise;
  }

  function loadThumbnails(galleryId) {
    var
      deferredThumbnails = $q.defer(),
      promises = [],
      photos = appDataService.getPhotos(galleryId),
      thumbs = {};

    angular.forEach(photos, function (photo, key) {
      var deferred = $q.defer();

      // Fixme: thumb directory as global constant
      fileSystemAPI.readFile(THUMBNAILS_DIR + '/' + photo.id).then(
        function (imgDataSrc) {
          // add image src to photo object
          thumbs[photo.id] = imgDataSrc;
          deferred.resolve();
        },
        function (e) {
          throw new Error('loading thumbnail', e);
          // resolve anyway to trigger $q.all
          deferred.resolve();
        }
      );
      promises.push(deferred.promise);
    });

    $q.all(promises).then(function () {
      deferredThumbnails.resolve(thumbs);
    });

    return deferredThumbnails.promise;
  }

  function removePhoto(photoId) {
    var promises = [];

    promises.push(fileSystemAPI.removeFile(THUMBNAILS_DIR + '/' + photoId));
    promises.push(fileSystemAPI.removeFile(photoId));

    return $q.all(promises);
  }

  function renameImageVariants(uploadObj) {
    var
      oldName = uploadObj.photoObj.id,
      newName = uploadObj.apiResult.remotePhotoId,
      deferred = $q.defer();

    // rename thumbnail
    fileSystemAPI.renameFile(THUMBNAILS_DIR, oldName, newName).then(function () {
      // rename main image
      fileSystemAPI.renameFile('', oldName, newName).then(function () {
        deferred.resolve(uploadObj);
      });
    }, function (e) {
      throw new Error("renaming file", e);
    });

    return deferred.promise;
  }

  $rootScope.$on('GALLERY-UPDATE', function () {
    saveAppData();
  });


  return {
    initStorage: initStorage,
    saveAppData: saveAppData,
    restoreAppData: restoreAppData,
    saveImageVariants: saveImageVariants,
    loadThumbnails: loadThumbnails,
    removePhoto: removePhoto,
    renameImageVariants: renameImageVariants,
    loadImage: loadImage
  };

});