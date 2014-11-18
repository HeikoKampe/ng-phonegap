'use strict';

// directive modifies ngModel for adding blurred state
// to form input elements
angular.module(_DIRECTIVES_).directive('ngModel', function () {

  return {
    require: '?ngModel',
    link: function (scope, elem, attr, ngModel) {
      elem.on('blur', function () {
        ngModel.$blurred = true;
        elem.addClass('blurred');
        scope.$apply();
      });
    }
  }

});
