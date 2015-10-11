angular.module(_CONTROLLERS_).controller('signinController', function ($rootScope,
                                                                       $scope,
                                                                       serverAPI,
                                                                       appDataService,
                                                                       exportService) {

  var USERNAME_MIN_LENGTH = 8;

  $scope.pageClass = 'page--signin';

  $scope.signinCredentials = {};
  $scope.showSigninFormErrors = false;


  function error(e) {
    console.log("error: ", e.data);
  }

  function setUserData(userData) {
    appDataService.setUserData({
      userToken: userData.data.token,
      userId: userData.data.id,
      userName: userData.data.username
    });
  }

  $scope.signinSubmit = function (isValid) {
    var
      credentials = {};

    if (isValid) {
      $scope.showSigninFormErrors = false;
      credentials.username = $scope.signinCredentials.username;
      credentials.email = $scope.signinCredentials.email;
      credentials.password = $scope.signinCredentials.password;
      serverAPI.signin(credentials).then(function (result) {
        console.log("signin result:", result);
        setUserData(result);
        exportService.uploadGalleries();
        exportService.addForeignGallerySubscriptionsToUser();
        $rootScope.go('share-gallery', 'slide-left');
      }, error);
    } else {
      $scope.showSigninFormErrors = true;
    }

  };

  $scope.onUsernameChange = function () {
    $scope.signinForm.username.$error.taken = false;

    serverAPI.checkUsername($scope.signinCredentials.username)
      .then(function (apiResult) {
        if (apiResult.foundUserByName === false) {
          $scope.signinForm.username.$error.taken = false;
        } else {
          $scope.signinForm.username.$error.taken = true;
        }
      });
  }


});
