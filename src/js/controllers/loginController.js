angular.module(_CONTROLLERS_).controller('loginController', function (
  $rootScope,
  $scope,
  serverAPI,
  appDataService,
  galleryImportService,
  storageService) {

  $scope.pageClass = 'page--login';
  $scope.loginCredentials = {};


  function setUserData (userData) {
    appDataService.setUserData({
      userToken: userData.token,
      userId: userData.id,
      userName: userData.username
    });
  }

  function onLoginError () {
    console.log('LOGIN FAILED');
  }

  function isLoggedInAsDifferentUser (newUserId) {
    var
      currentUserId = appDataService.getUserId();

    return currentUserId !== newUserId;
  }

  function switchToNewUser(apiResult) {
    storageService.deleteAllImages().then(function (){
      appDataService.resetAppData();
      setUserData(apiResult);
      galleryImportService.importAllGalleriesOfUser(apiResult.id).then(function(){
        $rootScope.go('select-gallery', 'slide-right');
      }, function (error) {
        console.log('importAllGalleriesOfUser was canceled');
      });
    }, function (err) {
      console.log('deleteAllImages error');
    });
  }

  $scope.loginSubmit = function (isValid) {
    var
      credentials = {};

    if (isValid) {
      $scope.showLoginFormErrors = false;
      credentials.usernameOrEmail = $scope.loginCredentials.usernameOrEmail;
      credentials.password = $scope.loginCredentials.password;
      serverAPI.login(credentials).then(function (apiResult) {
        console.log("login result:", apiResult);
        if (isLoggedInAsDifferentUser(apiResult.id)) {
          switchToNewUser(apiResult);
        } else {
          appDataService.setUserToken(apiResult.token);
          $rootScope.back();
        }

      }, onLoginError);
    }
  };



});
