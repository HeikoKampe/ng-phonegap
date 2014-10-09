angular.module(_FILTERS_).filter('notUploadedPhotosFilter', function () {
    'use strict';

    return function (photos) {
      var
        i, out = [];

      for (i = 0; i < photos.length; i++) {

        if (!photos[i].dateOfUpload) {
          out.push(photos[i]);
        }

      }

      return out;
    };
  });
