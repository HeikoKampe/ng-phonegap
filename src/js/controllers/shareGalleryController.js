angular.module(_CONTROLLERS_).controller('shareGalleryController', function ($rootScope, $scope, appDataService, exportService, authService) {


    $scope.pageClass = 'page--share-gallery';
    $scope.gallery = appDataService.getGallery();
    $scope.userName = appDataService.getUserName();
    $scope.galleryKeySegments = createGalleryKeySegments(appDataService.getGalleryKey());

    function createGalleryKeySegments(galleryKey) {
      var keySegments = [];

      if (galleryKey) {
        keySegments[0] = galleryKey.substr(0, 4);
        keySegments[1] = galleryKey.substr(4, 4);
        keySegments[2] = galleryKey.substr(8, 4);
      }

      return keySegments;
    }

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


    $scope.$on('GALLERY-UPDATE', function () {
      $scope.galleryKeySegments = createGalleryKeySegments(appDataService.getGalleryKey());
    });


  }
);
