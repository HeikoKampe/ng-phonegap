angular.module(_CONTROLLERS_).controller('authController', function (
  $rootScope,
  $scope,
  serverAPI,
  appDataService) {

  $scope.pageClass = 'page--signin';

  $scope.uploadPassword = '';


  function error(e) {
    console.log("error: ", e.data);
  }

  $scope.signinSubmit = function () {
    serverAPI.signin({'username': $scope.username, 'password': $scope.password}).then(function (result) {
      console.log("signin result:", result);
      appDataService.setUserToken(result.data.token);
      appDataService.setUserId(result.data.id);
      $rootScope.back();
    }, error);
  };

  $scope.uploadAuthSubmit = function () {

    var galleryId = appDataService.getActiveGalleryId();

    console.log("uploadAuthSubmit", $scope.uploadPassword, galleryId);

    serverAPI.uploadAuth({'uploadPassword': $scope.uploadPassword, 'galleryId': galleryId}).then(function (result) {
      console.log("upload-auth result:", result);
      appDataService.setUploadToken(result.data.uploadToken);
      // todo: show button with 'Proceed upload'
      $rootScope.back();

    }, error);
  };



});
