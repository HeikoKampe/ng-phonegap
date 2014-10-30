angular.module(_SERVICES_).factory('stackTraceService', function ($window) {
  'use strict';

  return {
    printStack: $window.printStackTrace
  };

});