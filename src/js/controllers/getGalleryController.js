angular.module(_CONTROLLERS_).controller('getGalleryController', function ($scope,
                                                                           $rootScope,
                                                                           $timeout,
                                                                           appDataService,
                                                                           serverAPI,
                                                                           galleryImportService) {

  $scope.pageClass = 'page--get-gallery';
  $scope.showCtrls = true;
  $scope.getGalleryStep = 1;
  $scope.galleryCredentials = {
    ownerName: '',
    galleryKey: ''
  };
  $scope.showForm1Errors = false;
  $scope.showForm2Errors = false;
  $scope.galleryOwnerNameError = false;
  $scope.galleryKeyError = false;


  function onGalleryOwnerError() {
    $scope.galleryOwnerNameError = true;
    $scope.showForm1Errors = true;
  }

  function onGalleryKeyError() {
    $scope.galleryKeyError = true;
    $timeout(function () {
      $scope.galleryKeyError = false;
      $scope.galleryCredentials.galleryKey = '';
    }, 1000)
  }

  $scope.onOwnerNameInputFocus = function () {
    $scope.galleryOwnerNameError = false;
    $scope.showForm1Errors = false;
  };

  $scope.onGetGalleryStep1Submit = function (isFormValid) {
    if (isFormValid) {
      serverAPI.checkUsername($scope.galleryCredentials.ownerName)
        .then(function (apiResult) {
          if (apiResult.foundUserByName) {
            $scope.getGalleryStep = 2;
          } else {
            onGalleryOwnerError();
          }
        }, onGalleryOwnerError);
    } else {
      $scope.showForm1Errors = true;
    }
  };

  $scope.onGetGalleryStep2Submit = function () {

    galleryImportService.importGalleryByUsernameAndKey($scope.galleryCredentials.ownerName, $scope.galleryCredentials.galleryKey)
      .then(function () {
        $scope.showErrorMessage = false;
        $rootScope.go('select-gallery', 'slide-left');
      }, onGalleryKeyError);
  };


});
