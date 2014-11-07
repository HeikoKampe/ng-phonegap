angular.module(_CONTROLLERS_).controller('inviteController', function ($scope, appDataService, serverAPI) {

  $scope.pageClass = 'page--invite';
  $scope.showCtrls = true;
  $scope.showForm = true;
  $scope.showSuccessMessage = false;
  $scope.showErrorMessage = false;
  $scope.formData = {};

  $scope.showInvitationForm = function () {
    $scope.showForm = true;
    $scope.showSuccessMessage = false;
    $scope.showErrorMessage = false;
  };

  $scope.invitationSubmit = function (isValid) {
    if (isValid) {
      $scope.formData.ownerUserName = appDataService.getUserName();
      $scope.formData.galleryKey = appDataService.getGalleryKey();
      serverAPI.sendInvitation($scope.formData).then(function () {
        $scope.showSuccessMessage = true;
        $scope.showForm = false;
      }, function(){
        $scope.showErrorMessage = true;
        $scope.showForm = false;
        throw new Error('email invitation error');
      });
    }
  };

});
