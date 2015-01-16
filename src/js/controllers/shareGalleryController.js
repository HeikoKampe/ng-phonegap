angular.module(_CONTROLLERS_).controller('shareGalleryController', function (
    $rootScope,
    $scope,
    $routeParams,
    appDataService,
    exportService,
    authService) {


    $scope.pageClass = 'page--share-gallery';
    $scope.sharingSection1 = $routeParams.section1;


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
        //exportService.uploadGallery();
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };

    $scope.onUploadPermissionChange = function () {
      exportService.updateUploadPermission($scope.gallery.galleryId, {'allowForeignUploads': $scope.gallery.settings.allowForeignUploads});
    };

    $scope.$on('GALLERY-UPDATE', function () {
      $scope.galleryKeySegments = createGalleryKeySegments(appDataService.getGalleryKey());
    });

    function init() {
      if ($rootScope.appDataReady) {
        $scope.gallery = appDataService.getGallery();
        $scope.appSettings = appDataService.getAppSettings();
        $scope.userName = appDataService.getUserName();
        $scope.galleryKeySegments = createGalleryKeySegments(appDataService.getGalleryKey());
      }
    }

    $scope.$on('APP-DATA-READY', function () {
      init();
    });

    init();


  }
);
