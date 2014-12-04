angular.module(_FILTERS_).filter('notUploadedAndDeletedPhotosFilter', function () {
    'use strict';

    return function (photos) {
      var
        i, out = [];

      for (i = 0; i < photos.length; i++) {
        if (!photos[i].dateOfUpload && photos[i].deleted === true) {
          out.push(photos[i]);
        }
      }

      return out;
    };
  });
