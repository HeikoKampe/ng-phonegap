angular.module(_CONTROLLERS_).controller('editGalleryController', function ($rootScope,
                                                                            $scope,
                                                                            $log,
                                                                            $filter,
                                                                            $q,
                                                                            appConstants,
                                                                            appDataService,
                                                                            storageService,
                                                                            eventService,
                                                                            syncService,
                                                                            authService,
                                                                            navigationService,
                                                                            serverAPI) {


        function updateGalleryStatus () {
            var
                deletedPhotos = $filter('photoFilter')($scope.gallery.photos, 'deleted', true, 'id'),
                newPhotos = $filter('notUploadedPhotosFilter')($scope.gallery.photos);

            $scope.highlightSharingBtn = (!$scope.gallery.dateOfUpload && newPhotos.length > 0);
            $scope.showDeleteSelectionBtn = (!$scope.gallery.dateOfUpload && deletedPhotos.length > 0);
            $scope.showUpdateBtn = ($scope.gallery.dateOfUpload && (deletedPhotos.length > 0 || newPhotos.length > 0)) ||
                !$scope.gallery.dateOfUpload && deletedPhotos.length > 0;
            $scope.showDeleteGalleryBtn = ($scope.gallery.photos.length === 0);
        }

        function updateThumbnails () {
            storageService.loadThumbnails().then(function (thumbnails) {
                $scope.thumbnails = thumbnails;
            });
        }

        function init () {
            if ($rootScope.appDataReady) {
                $scope.pageClass = 'page--edit-gallery';
                $scope.showCtrls = true;
                $scope.showUploadBtn = false;
                $scope.showUpdateBtn = false;
                $scope.showDeleteBtn = false;
                $scope.showDeleteGalleryBtn = false;
                $scope.gallery = appDataService.getGallery();
                $scope.isOwner = appDataService.isOwner();
                updateThumbnails();
                updateGalleryStatus();
            }
        }

        $scope.removePhoto = function () {
            appDataService.markPhotoAsDeleted(this.thumb.id);
        };

        $scope.togglePhoto = function () {
            appDataService.toggleMarkPhotoAsDeleted(this.photo.id);
            updateGalleryStatus();
        };

        $scope.onUpdateBtnClick = function () {
            if ($scope.gallery.dateOfUpload) {
                // to avoid conflict in case of broken uploads
                // always check remote before updating remote
                syncService.checkForRemoteChangesOfGallery($scope.gallery)
                    .then(function () {
                        syncService.uploadLocalChanges($scope.gallery.galleryId);
                    });
            } else {
                syncService.removeLocallyDeletedPhotos();
            }
            updateGalleryStatus();
        };

        $scope.onShareBtnClick = function () {
            navigationService.go(appConstants.STATES.SHAREGALLERY_SHARING, {animationClass: 'forward'});
        };

        $scope.onSlideshowBtnClick = function () {
            if ($scope.gallery.photos.length) {
                navigationService.go(appConstants.STATES.SLIDESHOW, {animationClass: 'forward'});
            }
        };

        $scope.onDeleteGalleryBtnClick = function () {
            if ($scope.gallery.dateOfUpload) {
                serverAPI.deleteGallery($scope.gallery.galleryId).then(function () {
                    appDataService.deleteGallery();
                    if (Object.keys(appDataService.getAppData().galleries).length > 0) {
                        navigationService.go(appConstants.STATES.SELECTGALLERY, {animationClass: 'backward'});
                    } else {
                        navigationService.go(appConstants.STATES.HOME, {animationClass: 'backward'});
                    }
                }, function () {
                    throw new Error('could not delete gallery from server');
                });
            } else {
                appDataService.deleteGallery();
                if (Object.keys(appDataService.getAppData().galleries).length > 0) {
                    navigationService.go(appConstants.STATES.SELECTGALLERY, {animationClass: 'backward'});
                } else {
                    navigationService.go(appConstants.STATES.HOME, {animationClass: 'backward'});
                }
            }
        };

        $scope.$on('GALLERY-UPDATE', function () {
            if ($rootScope.appDataReady) {
                updateThumbnails();
                updateGalleryStatus();
            }
        });

        $scope.$on('APP-DATA-READY', function () {
            init();
        });

        init();

    }
);
