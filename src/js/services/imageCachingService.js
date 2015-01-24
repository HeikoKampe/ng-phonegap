angular.module(_SERVICES_).service('imageCachingService', function (
    $q,
    fileSystemAPI,
    storageService,
    appDataService,
    appSettingsService,
    remoteImageImportService) {

    'use strict';

    function loadImage (photoId) {
      var
        galleryId = appDataService.getActiveGalleryId();

      return fileSystemAPI.checkFile(appSettingsService.SETTINGS.IMAGES_DIR + '/' + photoId)
        .then($q.when, function () {
          // if file is not in local filesystem anymore then get image from remote server again
          return remoteImageImportService.cacheImage(photoId, galleryId);
        })
        .then(function (){
          // if file is in local filesystem just load it
          return storageService.loadImage(photoId);
        })
    }

    return {
      loadImage: loadImage
    };

  }
)
;