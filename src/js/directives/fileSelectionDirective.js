angular.module(_DIRECTIVES_).directive('fileSelectionDirective', function($window) {
  'use strict';

  return {

    link: function (scope, element, attrs) {

      element.on('change', function (e) {
        scope.$apply(function () {
          scope.selectedFiles = e.target.files;
        });
      });

    }

  }

});
