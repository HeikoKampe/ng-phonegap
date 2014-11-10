angular.module(_SERVICES_).service('storageService', function ($rootScope, $log, $q, fileSystemAPI, eventService, appDataService, appSettingsService) {

  'use strict';

  function checkIfFirstRun() {
    var deferred = $q.defer();

    fileSystemAPI.checkFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME).then(function (result) {
      deferred.resolve(false);
    }, function (err) {
      deferred.resolve(true);
    });

    return deferred.promise;
  }

  function restoreAppData() {
    fileSystemAPI.readFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME).then(function (content) {
      appDataService.setAppData(angular.fromJson(content));
    }, function onReadFileError(e) {
      console.log(angular.toJson(e));
    });
  }

  function initStorage() {
    checkIfFirstRun().then(function (isFirstRun) {
      console.log('checkIfFirstRun', isFirstRun);
      if (isFirstRun) {
        fileSystemAPI.createDir(appSettingsService.SETTINGS.THUMBNAILS_DIR, true);
        saveAppData();
      } else {
      restoreAppData();
      }
    });
  }

  function saveAppData() {
    fileSystemAPI.writeFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, angular.toJson(appDataService.getAppData()), {}).then(function () {
      $log.log("app data saved", angular.toJson(appDataService.getAppData()));
    }, function (e) {
      throw new Error("saving app data", e);
    })
  }

  function saveThumbnailImage(importObj) {
    var
      deferred = $q.defer();

    fileSystemAPI.writeFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + importObj.photoObj.id, importObj.photoObj.thumbDataURI)
      .then(function () {
        delete importObj.photoObj.thumbDataURI;
        deferred.resolve(importObj);
      },
      function (msg) {
        delete importObj.photoObj.thumbDataURI;
        deferred.reject(msg);
      });

    return deferred.promise;
  }

  function saveMainImage(importObj) {
    var
      deferred = $q.defer();

    fileSystemAPI.writeFile(importObj.photoObj.id, importObj.photoObj.mainDataURI)
      .then(function () {
        delete importObj.photoObj.mainDataURI;
        deferred.resolve(importObj);
      },
      function (msg) {
        delete importObj.photoObj.mainDataURI;
        deferred.reject(msg);
      });

    return deferred.promise;
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
      fileSystemAPI.readFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + photo.id).then(
        function (imgDataSrc) {
          // add image src to photo object
          thumbs[photo.id] = imgDataSrc;
          deferred.resolve();
        },
        function onReadThumbnailError(e) {
          throw new Error(angular.toJson(e));
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

    promises.push(fileSystemAPI.removeFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + photoId));
    promises.push(fileSystemAPI.removeFile(photoId));

    return $q.all(promises);
  }

  function renameImageVariants(uploadObj) {
    var
      oldName = uploadObj.photoObj.id,
      newName = uploadObj.apiResult.remotePhotoId,
      deferred = $q.defer();

    // rename thumbnail
    fileSystemAPI.renameFile(appSettingsService.SETTINGS.THUMBNAILS_DIR, oldName, newName).then(function () {
      // rename main image
      fileSystemAPI.renameFile('', oldName, newName).then(function () {
        deferred.resolve(uploadObj);
      });
    }, function onRenameFileError(e) {
      throw new Error(angular.toJson(e));
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