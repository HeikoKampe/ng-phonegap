angular.module(_CONTROLLERS_).controller('authController', function (
  $rootScope,
  $scope,
  serverAPI,
  appDataService) {

  $scope.pageClass = 'page--signin';

  $scope.uploadPassword = '';
  $scope.signinCredentials = {};
  $scope.showSigninFormErrors = false;


  function error(e) {
    console.log("error: ", e.data);
  }

  $scope.signinSubmit = function (isValid) {
    var credentials = {};

    if (isValid) {
      $scope.showSigninFormErrors = false;
      credentials.username = $scope.signinCredentials.username;
      credentials.email = $scope.signinCredentials.email;
      credentials.password = $scope.signinCredentials.password;
      serverAPI.signin(credentials).then(function (result) {
        console.log("signin result:", result);
        appDataService.setUserData({
          userToken: result.data.token,
          userId: result.data.id,
          userName: credentials.username
        });
        $rootScope.go('share-gallery', 'slide-left');
      }, error);
    } else {
      $scope.showSigninFormErrors = true;
    }


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
