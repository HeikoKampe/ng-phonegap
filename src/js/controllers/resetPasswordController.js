angular.module(_CONTROLLERS_).controller('resetPasswordController', function (
  $rootScope,
  $scope,
  serverAPI,
  messageService) {

  $scope.pageClass = 'page--login';
  $scope.showResetPasswordForm = false;
  $scope.showRequestPasswordPinErrors = false;
  $scope.showResetPasswordErrors = false;
  $scope.resetPwdCredentials = {};


  $scope.requestPasswordPinSubmit = function (isValid) {
    var resetPwdCredentials = {};

    if (isValid) {
      $scope.showRequestPasswordPinErrors = false;
      resetPwdCredentials.email = $scope.resetPwdCredentials.email;

      serverAPI.requestPasswordPin(resetPwdCredentials).then(function (result) {
        console.log("SUCCESS");
        $scope.showResetPasswordForm = true;
      });
    }
  };

  $scope.resetPasswordSubmit = function (isValid) {
    var resetPwdCredentials = {};


    if (isValid) {
      $scope.showResetPasswordErrors = false;
      resetPwdCredentials.email = $scope.resetPwdCredentials.email;
      resetPwdCredentials.pin = $scope.resetPwdCredentials.pin;
      resetPwdCredentials.password = $scope.resetPwdCredentials.password;

      serverAPI.resetPassword(resetPwdCredentials).then(function (result) {
        var successMessage = {
          title: 'success',
          content: 'Your password has been update. Please login with your new password.'
        };

        console.log("SUCCESS");
        messageService.showMessage(successMessage);
        $rootScope.go('login', 'slide-right');
      });
    }
  };

});
