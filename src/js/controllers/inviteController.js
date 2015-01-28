angular.module(_CONTROLLERS_).controller('inviteController', function ($rootScope, $scope, $filter, appDataService, serverAPI) {

  $scope.pageClass = 'page--invite';
  $scope.showCtrls = true;
  $scope.showForm = true;
  $scope.showFormErrors = false;
  $scope.showSuccessMessage = false;
  $scope.showErrorMessage = false;
  $scope.formData = {
    message: $filter('translate')('MSG_DEFAULT_EMAIL_INVITATION')
  };
  $scope.gallery = {};

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
    } else {
      $scope.showFormErrors = true;
    }
  };

  function init() {
    if ($rootScope.appDataReady && appDataService.getActiveGalleryId() !== -1) {
      $scope.gallery = appDataService.getGallery();
    }

  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
