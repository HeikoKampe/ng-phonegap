angular.module(_CONTROLLERS_).controller('shareGalleryController', function (
    $rootScope,
    $scope,
    appDataService,
    exportService,
    authService) {


    $scope.pageClass = 'page--share-gallery';
    $scope.showAccessKey = false;
    $scope.showAllowForeignUploadUpgradeInfo = false;

    $scope.onAllowForeignUploadsClick = function () {
      $scope.showAllowForeignUploadUpgradeInfo = true;
    };

    $scope.toggleShowAccessKey = function () {
      $scope.showAccessKey = !$scope.showAccessKey;
    };
    
    $scope.onShareGalleryBtnClick = function () {
      if (authService.isAuthorized()) {
        exportService.uploadGallery();
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };

    $scope.onUploadPermissionChange = function () {
      exportService.updateUploadPermission($scope.gallery.galleryId, {'allowForeignUploads': $scope.gallery.settings.allowForeignUploads});
    };

    $scope.$on('GALLERY-UPDATE', function () {

    });

    function init() {
      if ($rootScope.appDataReady) {
        $scope.gallery = appDataService.getGallery();
        $scope.appSettings = appDataService.getAppSettings();
        $scope.userName = appDataService.getUserName();
      }
    }

    $scope.$on('APP-DATA-READY', function () {
      init();
    });

    init();


  }
);
