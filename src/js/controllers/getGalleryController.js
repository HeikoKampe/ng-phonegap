angular.module(_CONTROLLERS_).controller('getGalleryController', function ($scope,
                                                                           $rootScope,
                                                                           appDataService,
                                                                           serverAPI,
                                                                           galleryImportService) {

  $scope.pageClass = 'page--get-gallery';
  $scope.showCtrls = true;
  $scope.galleryKeySegments = [];
  $scope.galleryOwnerName = '';
  $scope.showErrorMessage = false;


  function onImportError () {
    $scope.showErrorMessage = true;
  }

  $scope.onContinueBtnClick = function () {
    var galleryKey = $scope.galleryKeySegments[0] + $scope.galleryKeySegments[1] + $scope.galleryKeySegments[2];

    galleryImportService.importGalleryByUsernameAndKey($scope.galleryOwnerName, galleryKey)
      .then(function () {
        $scope.showErrorMessage = false;
        $rootScope.go('select-gallery', 'slide-left');
      }, onImportError);
  };


});
