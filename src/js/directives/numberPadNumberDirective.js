angular.module(_DIRECTIVES_).directive('numberPadNumberDirective', function() {
  'use strict';

  return {

    link: function (scope, element, attrs) {

      element.on('click', function (e) {
        console.log('clicked');
      });

    }

  }

});
