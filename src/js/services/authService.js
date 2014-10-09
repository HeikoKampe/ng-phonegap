'use strict';

angular.module(_SERVICES_).factory('authService', function (appDataService) {

  function isAuthorized() {
    var userToken = appDataService.getUserToken();
    return  !(userToken === '' || userToken == undefined);
  }

  function hasUploadPermission() {
    var uploadToken = appDataService.getUploadToken();
    return  !(uploadToken === '' || uploadToken == undefined) || appDataService.isOwner();
  }

  return {
    isAuthorized: isAuthorized,
    hasUploadPermission: hasUploadPermission
  };

});