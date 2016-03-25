angular.module(_CONTROLLERS_).controller('shareGalleryController', function ($rootScope,
                                                                             $scope,
                                                                             $state,
                                                                             appConstants,
                                                                             appDataService,
                                                                             exportService,
                                                                             authService,
                                                                             navigationService) {


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
            if ($scope.isAuthorized) {
                if (!$scope.gallery.dateOfUpload) {
                    console.log('uploading Gallery ...');
                    exportService.uploadGallery().then(function () {
                        console.log('upload finished');
                    });
                }
            } else {
                navigationService.go(appConstants.STATES.SIGNIN, {
                    animationClass: 'forward',
                    returnState: appConstants.STATES.SHAREGALLERY_SHARING
                });
            }
        };

        $scope.onUploadPermissionChange = function () {
            exportService.updateUploadPermission($scope.gallery.galleryId, {'allowForeignUploads': $scope.gallery.settings.allowForeignUploads});
        };

        $scope.$on('GALLERY-UPDATE', function () {

        });

        function init () {
            var prevState;

            if ($rootScope.appDataReady) {
                $scope.isAuthorized = authService.isAuthorized();
                $scope.gallery = appDataService.getGallery();
                $scope.appSettings = appDataService.getAppSettings();
                $scope.userName = appDataService.getUserName();
                prevState = navigationService.getPrevState();
            }

            // upload gallery immediately after successful login or signin
            if ($scope.isAuthorized && !$scope.gallery.dateOfUpload && (prevState === appConstants.STATES.SIGNIN || prevState === appConstants.STATES.LOGIN)) {
                console.log('uploading Gallery ...');
                exportService.uploadGallery().then(function () {
                    console.log('upload finished');
                });
            }
        }

        $scope.$on('APP-DATA-READY', function () {
            init();
        });

        init();


    }
);
