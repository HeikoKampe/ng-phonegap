angular.module(_CONTROLLERS_).controller('loginController', function (
  $rootScope,
  $scope,
  serverAPI,
  appDataService,
  importService) {

  $scope.pageClass = 'page--login';
  $scope.loginCredentials = {};


  function setUserData (userData) {
    appDataService.setUserData({
      userToken: userData.token,
      userId: userData.id,
      userName: userData.username
    });
  }

  $scope.loginSubmit = function (isValid) {
    var
      credentials = {};

    if (isValid) {
      $scope.showLoginFormErrors = false;
      credentials.usernameOrEmail = $scope.loginCredentials.usernameOrEmail;
      credentials.password = $scope.loginCredentials.password;
      serverAPI.login(credentials).then(function (result) {
        console.log("login result:", result);
        setUserData(result.data);
        importService.importGalleriesOfOwner(result.data.id).then(function(){
          $rootScope.go('select-gallery', 'slide-right');
        });
      });
    }
  };

  $scope.onCancelBtnClick = function () {
    console.log("cancel");
    importService.cancelImport();
  }

});
