angular.module(_SERVICES_).service('storageService', function ($rootScope, $log, $q, fileSystemAPI, eventService, appDataService) {

  'use strict';

  var thumbnailsDirectory = 'thumbnails/'; // todo: move to settings

  function saveAppData() {
    fileSystemAPI.writeFile('appData.txt', angular.toJson(appDataService.getAppData())).then(function () {
      $log.log("app data saved");
    }, function (e) {
      throw new Error("saving app data", e);
    })
  }

  function restoreAppData() {
    fileSystemAPI.readFile('appData.txt').then(function (content) {
      appDataService.setAppData(angular.fromJson(content, true));
    }, function (e) {
      console.log("Error: restoring app data failed", e);
    });
  }

  function saveThumbnailImage(importObj) {
    var
      deferredImportObj = $q.defer();

    fileSystemAPI.writeFile(thumbnailsDirectory + importObj.photoObj.id, importObj.photoObj.thumbDataURI)
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
      fileSystemAPI.readFile(thumbnailsDirectory + photo.id).then(
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

    promises.push(fileSystemAPI.deleteFile(thumbnailsDirectory + photoId));
    promises.push(fileSystemAPI.deleteFile(photoId));

    return $q.all(promises);
  }

  function renameImageVariants(uploadObj) {
    var
      oldName = uploadObj.photoObj.id,
      newName = uploadObj.apiResult.remotePhotoId,
      deferred = $q.defer();

    // rename thumbnail
    fileSystemAPI.renameFile(thumbnailsDirectory, thumbnailsDirectory + oldName, newName).then(function () {
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
    saveAppData: saveAppData,
    restoreAppData: restoreAppData,
    saveImageVariants: saveImageVariants,
    loadThumbnails: loadThumbnails,
    removePhoto: removePhoto,
    renameImageVariants: renameImageVariants,
    loadImage: loadImage
  };

});