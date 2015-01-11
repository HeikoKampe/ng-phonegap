angular.module(_DIRECTIVES_).directive('numberPadDirective', function ($timeout) {
  'use strict';

  var
    TEMPLATE_BASE_PATH = 'html/partials/global/',
    INPUT_LENGTH = 4;

  return {

    restrict: 'A',
    templateUrl: TEMPLATE_BASE_PATH + 'number-pad.html',
    scope: {
      numberPadInput: '=',
      numberPadSubmit: '&'
    },

    link: function (scope, element, attrs) {
      angular.element(element[0].querySelectorAll(".number-pad__item--number-btn")).on('click', function (e) {
        // on number button click
        var numberBtnValue = angular.element(this).text();
        if (scope.numberPadInput.length < INPUT_LENGTH) {
          scope.$apply(function () {
            scope.numberPadInput += numberBtnValue;
          });
        }
      });

      angular.element(element[0].querySelector(".number-pad__item--del-btn")).on('click', function (e) {
        // on delete button click
        if (scope.numberPadInput.length) {
          scope.$apply(function () {
            scope.numberPadInput = scope.numberPadInput.slice(0, -1)
          });
        }
      });

      angular.element(element[0].querySelector(".number-pad__item--submit-btn")).on('click', function (e) {
        // on submit button click
        scope.numberPadSubmit();
      });

    }

  }

});
