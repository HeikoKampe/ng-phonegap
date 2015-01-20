angular.module(_CONTROLLERS_).controller('settingsAccountController', function ($rootScope,
                                                                                $scope,
                                                                                $location,
                                                                                $timeout,
                                                                                appDataService,
                                                                                serverAPI,
                                                                                eventService,
                                                                                messageService) {


  $scope.resetPwdStep = 1;
  $scope.emailNotFoundError = false;
  $scope.securityPinError = false;

  $scope.resetPwdObj = {
    email: '',
    newPassword: '',
    securityPin: ''
  };

  $scope.onEmailInputFocus = function () {
    $scope.emailNotFoundError = false;
  };

  $scope.requestPasswordPinSubmit = function (isValid) {
    if (isValid) {
      serverAPI.requestPasswordPin({'email': $scope.resetPwdObj.email})
        .then(function (result) {
          $scope.resetPwdStep = 2;
        }, function () {
          $scope.emailNotFoundError = true;
        });
    }
  };

  function onSecurityPinError() {
    $scope.securityPinError = true;
    $timeout(function () {
      $scope.securityPinError = false;
      $scope.resetPwdObj.securityPin = '';
    }, 1000)
  }

  $scope.resetPasswordSubmit = function (isValid) {

    serverAPI.resetPassword($scope.resetPwdObj).then(function (result) {
      console.log("SUCCESS");
      // clear user token
      appDataService.setUserToken("");
      eventService.broadcast('GALLERY-UPDATE');
      $rootScope.go('login', 'slide-right');
    }, onSecurityPinError);
  };


});
