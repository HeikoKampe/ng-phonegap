angular.module(_CONTROLLERS_).controller('signinController', function ($rootScope,
                                                                       $scope,
                                                                       serverAPI,
                                                                       appDataService) {

  var USERNAME_MIN_LENGTH = 8;

  $scope.pageClass = 'page--signin';

  $scope.signinCredentials = {};
  $scope.showSigninFormErrors = false;


  function error(e) {
    console.log("error: ", e.data);
  }

  function setUserData (userData) {
    appDataService.setUserData({
      userToken: userData.data.token,
      userId: userData.data.id,
      userName: userData.data.username
    });
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
        setUserData(result);
        $rootScope.go('share-gallery', 'slide-left');
      }, error);
    } else {
      $scope.showSigninFormErrors = true;
    }

  };

  $scope.onUsernameChange = function () {
    $scope.signinForm.username.$error.taken = false;

    serverAPI.validateUsername($scope.signinCredentials.username)
      .then(function (apiResult) {
        if (apiResult.data.isValid) {
          $scope.signinForm.username.$error.taken = false;
          console.log('is valid username: ', apiResult.data.isValid);
        } else {
          $scope.signinForm.username.$error.taken = true;
          console.log('is valid username: ', apiResult.data.isValid);
        }
      });
  }


});
