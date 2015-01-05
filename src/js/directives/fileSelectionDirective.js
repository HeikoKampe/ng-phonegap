angular.module(_DIRECTIVES_).directive('fileSelectionDirective', function(appDataService) {
  'use strict';

  return {

    link: function (scope, element, attrs) {

      element.on('click', function (e) {
        if (appDataService.getNumberOfPhotos() >= appDataService.getPhotosLimit()) {
          e.preventDefault();
          scope.showLimitReachedMessage();
        }
      });

      element.on('change', function (e) {
        scope.$apply(function () {
          scope.selectedFiles = e.target.files;
        });
      });

    }

  }

});
