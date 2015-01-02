angular.module(_SERVICES_).service('storageService', function ($rootScope, $log, $q, fileSystemAPI, eventService, appDataService, appSettingsService) {

    'use strict';

    function setAppDataReadyStatus() {
      $rootScope.appDataReady = true;
      eventService.broadcast("APP-DATA-READY");
    }

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
        setAppDataReadyStatus();
      }, function onReadFileError(e) {
        console.log('app data file read error: ', angular.toJson(e));
      });
    }

    function initStorage() {
      checkIfFirstRun().then(function (isFirstRun) {
        console.log('checkIfFirstRun', isFirstRun);
        if (isFirstRun) {
          fileSystemAPI.createDir(appSettingsService.SETTINGS.THUMBNAILS_DIR, true);
          saveAppData();
          setAppDataReadyStatus();
        } else {
          restoreAppData();
        }
      });
    }

    function saveAppData() {
      var appDataJson = angular.toJson(appDataService.getAppData());

      fileSystemAPI.writeFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, appDataJson).then(function (test) {
        //$log.log("app data saved", angular.toJson(appDataService.getAppData()));
        $log.log("app data saved");
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
      var
        deferred = $q.defer();

      if (importObj.batchObject && importObj.batchObject.cancelObject.isCancelled) {
        deferred.reject(new Error('cancel batch'));
      } else {
        saveMainImage(importObj)
          .then(saveThumbnailImage)
          .then(function (importObj) {
            deferred.resolve(importObj);
          });
      }

      return deferred.promise;
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

    function removePhotos(photosArray) {
      var
        i, promises = [];

      for (i = 0; i < photosArray.length; i++) {
        promises.push(removePhoto(photosArray[i].id));
      }

      return $q.all(promises);
    }

    function renameImageVariants2(photoObj) {
      var
        deferred = $q.defer();

      console.log('111', photoObj);

      // rename thumbnail
      fileSystemAPI.renameFile(appSettingsService.SETTINGS.THUMBNAILS_DIR, photoObj.localId, photoObj.id).then(function () {
        console.log('222', photoObj);
        // rename main image
        fileSystemAPI.renameFile('', photoObj.localId, photoObj.id).then(function () {
          console.log('333', photoObj);
          deferred.resolve();
        });
      }, function onRenameFileError(e) {
        throw new Error(angular.toJson(e));
      });

      return deferred.promise;
    }

    function renameImageVariants(oldName, newName) {
      var
        deferred = $q.defer();

      // rename thumbnail
      fileSystemAPI.renameFile(appSettingsService.SETTINGS.THUMBNAILS_DIR, oldName, newName)
        .then(function () {
          // rename main image
          return fileSystemAPI.renameFile('', oldName, newName);
        })
        .then(function () {
          // on success
          deferred.resolve();
        })
        .catch(function (error) {
          // on error
          deferred.reject(error);
        });

      return deferred.promise;
    }

    function renameImageVariantsAfterUpload(uploadObj) {
      var
        oldName = uploadObj.photoObj.id,
        newName = uploadObj.apiResult.id,
        deferred = $q.defer();

      if (uploadObj.batchObject && uploadObj.batchObject.isCancelled) {
        console.log("abort");
        return deferred.reject(new Error('cancel batch'));
      } else {
        renameImageVariants(oldName, newName)
          .then(function () {
            deferred.resolve(uploadObj);
          })
          .catch(function (error) {
            deferred.reject(error);
          });
      }

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
      removePhotos: removePhotos,
      renameImageVariants: renameImageVariants,
      renameImageVariantsAfterUpload: renameImageVariantsAfterUpload,
      loadImage: loadImage
    };

  }
)
;