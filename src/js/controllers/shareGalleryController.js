angular.module(_CONTROLLERS_).controller('shareGalleryController', function ($rootScope,
                                                                             $scope,
                                                                             appDataService,
                                                                             exportService,
                                                                             authService) {


    $scope.pageClass = 'page--share-gallery';
    $scope.gallery = appDataService.getGallery();
    $scope.userName = appDataService.getUserName();

    $scope.onShareGalleryBtnClick = function () {
      if (authService.isAuthorized()) {
        exportService.uploadGallery();
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };

    $scope.onSettingsChange = function () {
      exportService.uploadGallerySettings($scope.gallery.galleryId, $scope.gallery.settings);
    };

  }
);
