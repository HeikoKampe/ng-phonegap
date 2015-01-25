angular.module(_SERVICES_).service('storageService', function (
    $rootScope,
    $log,
    $q,
    fileSystemAPI,
    eventService,
    appDataService,
    appSettingsService) {

    'use strict';

    function setAppDataReadyStatus() {
      $rootScope.appDataReady = true;
      eventService.broadcast("APP-DATA-READY");
    }

    function checkIfFirstRun() {
      var deferred = $q.defer();

      fileSystemAPI.checkFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, 3).then(function (result) {
        deferred.resolve(false);
      }, function (err) {
        deferred.resolve(true);
      });

      return deferred.promise;
    }

    function restoreAppData() {
      fileSystemAPI.readFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, 3).then(function (content) {
        appDataService.setAppData(angular.fromJson(content));
        setAppDataReadyStatus();
      }, function onReadFileError(e) {
        // todo: implement recovery
        console.log('app data file read error: ', angular.toJson(e));
      });
    }

    function initStorage() {
      checkIfFirstRun().then(function (isFirstRun) {
        console.log('checkIfFirstRun', isFirstRun);
        if (isFirstRun) {
          fileSystemAPI.createDir(appSettingsService.SETTINGS.THUMBNAILS_DIR, true, 4);
          fileSystemAPI.createDir(appSettingsService.SETTINGS.IMAGES_DIR, true, 7);
          appDataService.initAppData();
          saveAppData();
          setAppDataReadyStatus();
        } else {
          restoreAppData();
        }
      });
    }

    function saveAppData() {
      var appDataJson = angular.toJson(appDataService.getAppData());

      fileSystemAPI.writeFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, appDataJson, 3).then(function () {
        //$log.log("app data saved", angular.toJson(appDataService.getAppData()));
        $log.log("app data saved");
      }, function (e) {
        throw new Error("saving app data", e);
      })
    }

    function saveThumbnailImage(importObj) {
      var
        deferred = $q.defer();

      fileSystemAPI.writeFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + importObj.photoObj.id, importObj.photoObj.thumbDataURI, 4)
        .then(function () {
          // release memory
          delete importObj.photoObj.thumbDataURI;
          deferred.resolve(importObj);
        },
        function (msg) {
          // release memory
          delete importObj.photoObj.thumbDataURI;
          deferred.reject(msg);
        });

      return deferred.promise;
    }

    function saveMainImage(importObj) {
      var
        deferred = $q.defer();

      fileSystemAPI.writeFile(appSettingsService.SETTINGS.IMAGES_DIR + '/' + importObj.photoObj.id, importObj.photoObj.mainDataURI, 7)
        .then(function () {
          // release memory
          delete importObj.photoObj.mainDataURI;
          deferred.resolve(importObj);
        },
        function (msg) {
          // release memory
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
          })
          .catch(function (error){
            deferred.reject(error);
        });
      }

      return deferred.promise;
    }

    function deleteImageVariants(uploadObj) {
      var
        deferred = $q.defer();

      if (uploadObj.batchObject && uploadObj.batchObject.cancelObject.isCancelled) {
        deferred.reject(new Error('cancel batch'));
      } else {
        fileSystemAPI.removeFile(appSettingsService.SETTINGS.IMAGES_DIR + '/' + uploadObj.photoObj.id, 7)
          .then(function () {
            return fileSystemAPI.removeFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + uploadObj.photoObj.id, 4);
          })
          .then(deferred.resolve);
      }

      return deferred.promise;
    }

    function deleteImageVariantsById(photoId) {
      return fileSystemAPI.removeFile(appSettingsService.SETTINGS.IMAGES_DIR + '/' + photoId, 7)
        .then(function () {
          return fileSystemAPI.removeFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + photoId, 4);
        });
    }


    function loadImage(photoId) {
      var
        deferredImage = $q.defer();

      fileSystemAPI.readFile(appSettingsService.SETTINGS.IMAGES_DIR + '/' + photoId, 7).then(
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

        fileSystemAPI.readFile(appSettingsService.SETTINGS.THUMBNAILS_DIR + '/' + photo.id, 4).then(
          function (imgDataSrc) {
            // add image src to photo object
            thumbs[photo.id] = imgDataSrc;
            deferred.resolve();
          },
          function onReadThumbnailError(e) {
            throw new Error('reading tumbnail file ' + photo.id);
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

    function renameImageVariants(oldName, newName) {
      var
        deferred = $q.defer();

      // rename thumbnail
      fileSystemAPI.renameFile(appSettingsService.SETTINGS.THUMBNAILS_DIR, oldName, newName, 4)
        .then(function () {
          // rename main image
          return fileSystemAPI.renameFile(appSettingsService.SETTINGS.IMAGES_DIR, oldName, newName, 7);
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

      if (uploadObj.batchObject && uploadObj.batchObject.cancelObject.isCancelled) {
        console.log("abort");
        deferred.reject(new Error('cancel batch'));
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

    function clearDir (dirPath, fileSystemId) {
      var
        deferred = $q.defer(),
        promises = [];

      fileSystemAPI.listDir(dirPath, fileSystemId).then(function(fileEntries) {
        angular.forEach(fileEntries, function (fileEntry){
          if (fileEntry.isFile) {
            console.log('fileEntry: ', fileEntry);
            promises.push(fileSystemAPI.removeFile(fileEntry.fullPath, fileSystemId));
          }
        });
        $q.all(promises).then(deferred.resolve, deferred.reject);
      });

      return deferred.promise;
    }

    function deleteAllImages () {
      var
        promises = [];

      promises.push(clearDir(appSettingsService.SETTINGS.IMAGES_DIR, 7));
      promises.push(clearDir(appSettingsService.SETTINGS.THUMBNAILS_DIR, 4));

      return $q.all(promises);
    }

    function deleteAppDataFile () {
      return fileSystemAPI.removeFile(appSettingsService.SETTINGS.APP_DATA_FILE_NAME, 3);
    }

    return {
      initStorage: initStorage,
      saveAppData: saveAppData,
      restoreAppData: restoreAppData,
      saveImageVariants: saveImageVariants,
      deleteImageVariants: deleteImageVariants,
      deleteImageVariantsById: deleteImageVariantsById,
      loadThumbnails: loadThumbnails,
      loadImage: loadImage,
      renameImageVariants: renameImageVariants,
      renameImageVariantsAfterUpload: renameImageVariantsAfterUpload,
      deleteAllImages: deleteAllImages,
      deleteAppDataFile: deleteAppDataFile
    };

  }
)
;