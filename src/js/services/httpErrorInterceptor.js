angular.module(_SERVICES_).factory('httpErrorInterceptor', function ($q, $rootScope) {
  'use strict';

  return {

    responseError: function (response) {

      if (response.status === 401 && response.data === 'invalid token') {
        console.log('INVALID TOKEN');
        $rootScope.go(appConstants.STATES.LOGIN, 'slide-left');
        return $q.reject(response);
      }

      return response;
    }
  };

});