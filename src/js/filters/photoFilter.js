angular.module(_FILTERS_).filter('photoFilter', function () {
    'use strict';

    return function (photos, filterKey, filterValue, returnProperty) {
      var
        returnPropertyValue,
        out = [];

      angular.forEach(photos, function (photo) {
        if (photo[filterKey] === filterValue) {
          returnPropertyValue = returnProperty ? photo[returnProperty] : photo;
          out.push(returnPropertyValue);
        }
      });

      return out;
    };
  });
