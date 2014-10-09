angular.module(_CONTROLLERS_).controller('shareGalleryController', function ($rootScope,
                                                                             $scope,
                                                                             appDataService,
                                                                             exportService,
                                                                             authService) {


    $scope.gallery = appDataService.getGallery();

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
