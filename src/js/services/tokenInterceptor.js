angular.module(_SERVICES_).factory('tokenInterceptor', function ($q, appDataService) {
  'use strict';

  return {
    request: function (config) {
      var
        userToken = appDataService.getUserToken(),
        uploadToken = appDataService.getUploadToken();

      config.headers = config.headers || {};

      if (userToken) {
        config.headers['x-access-token1'] = userToken;
      }

      if (uploadToken) {
        config.headers['x-access-token2'] = uploadToken;
      }

      return config;
    },

    response: function (response) {
      return response || $q.when(response);
    }
  };

});