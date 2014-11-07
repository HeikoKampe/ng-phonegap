'use strict';

angular.module(_SERVICES_).factory('momentjs', function ($window) {

  return $window.moment;

});