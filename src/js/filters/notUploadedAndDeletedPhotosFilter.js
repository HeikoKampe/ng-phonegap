angular.module(_FILTERS_).filter('notUploadedAndDeletedPhotosFilter', function () {
    'use strict';

    return function (photos, propertyKey) {
      var
        i, out = [];

      for (i = 0; i < photos.length; i++) {
        if (!photos[i].dateOfUpload && photos[i].deleted === true) {
          if (propertyKey && photos[i][propertyKey]) {
            out.push(photos[i][propertyKey]);
          } else {
            out.push(photos[i]);
          }
        }
      }

      return out;
    };
  });
