angular.module(_SERVICES_).factory('tokenInterceptor', function ($q, appDataService) {
  'use strict';

  return {
    request: function (config) {
      var
        userToken = appDataService.getUserToken(),
        galleryToken = appDataService.getGalleryToken();

      config.headers = config.headers || {};

      if (userToken) {
        config.headers['x-access-token1'] = userToken;
      }

      if (galleryToken) {
        config.headers['x-access-token2'] = galleryToken;
      }

      return config;
    },

    response: function (response) {
      return response || $q.when(response);
    }
  };

});