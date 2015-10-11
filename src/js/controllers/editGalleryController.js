angular.module(_CONTROLLERS_).controller('editGalleryController', function ($rootScope,
                                                                            $scope,
                                                                            $log,
                                                                            $filter,
                                                                            $q,
                                                                            appDataService,
                                                                            storageService,
                                                                            exportService,
                                                                            eventService,
                                                                            syncService,
                                                                            authService,
                                                                            serverAPI) {

    $scope.pageClass = 'page--edit-gallery';
    $scope.showCtrls = true;
    $scope.showUploadBtn = false;
    $scope.showUpdateBtn = false;
    $scope.showDeleteBtn = false;
    $scope.showDeleteGalleryBtn = false;

    function updateGalleryStatus() {
      var
        deletedPhotos = $filter('photoFilter')($scope.gallery.photos, 'deleted', true, 'id'),
        newPhotos = $filter('notUploadedPhotosFilter')($scope.gallery.photos);

      $scope.highlightSharingBtn = (!$scope.gallery.dateOfUpload && newPhotos.length > 0);
      $scope.showDeleteSelectionBtn = (!$scope.gallery.dateOfUpload && deletedPhotos.length > 0);
      $scope.showUpdateBtn = ($scope.gallery.dateOfUpload && (deletedPhotos.length > 0 || newPhotos.length > 0)) ||
      !$scope.gallery.dateOfUpload && deletedPhotos.length > 0;
      $scope.showDeleteGalleryBtn = ($scope.gallery.photos.length === 0);
    }

    function uploadGallery() {
      exportService.uploadGallery();
    }

    function updateThumbnails() {
      storageService.loadThumbnails().then(function (thumbnails) {
        $scope.thumbnails = thumbnails;
      });
    }

    $scope.removePhoto = function () {
      appDataService.markPhotoAsDeleted(this.thumb.id);
    };

    $scope.togglePhoto = function (photoIndex) {
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

    $scope.onUploadBtnClick = function () {
      if (authService.isAuthorized()) {
        uploadGallery();
      } else {
        $rootScope.go('signin', 'slide-left', true);
      }
    };

    $scope.onShareBtnClick = function () {
      if (authService.isAuthorized()) {
        // check if gallery is uploaded
        if (!$scope.gallery.dateOfUpload) {
          // upload gallery to server
          exportService.uploadGallery($scope.gallery.galleryId).then(function () {
            $rootScope.go('share-gallery', 'slide-left');
          });
        } else {
          $rootScope.go('share-gallery', 'slide-left');
        }

      } else {
        $rootScope.go('signin', 'slide-left', true);
      }
    };

    $scope.onSlideshowBtnClick = function () {
      if ($scope.gallery.photos.length) {
        $rootScope.go('slideshow', 'slide-left');
      }
    };

    $scope.onDeleteGalleryBtnClick = function () {
      if ($scope.gallery.dateOfUpload) {
        serverAPI.deleteGallery($scope.gallery.galleryId).then(function () {
          appDataService.deleteGallery();
          if (Object.keys(appDataService.getAppData().galleries).length > 0) {
            $rootScope.go('select-gallery', 'slide-right');
          } else {
            $rootScope.go('/home', 'slide-right');
          }
        }, function () {
          throw new Error('could not delete gallery from server');
        });
      } else {
        appDataService.deleteGallery();
        if (Object.keys(appDataService.getAppData().galleries).length > 0) {
          $rootScope.go('select-gallery', 'slide-right');
        } else {
          $rootScope.go('/home', 'slide-right');
        }
      }

    };

    function init() {
      if ($rootScope.appDataReady) {
        $scope.gallery = appDataService.getGallery();
        updateThumbnails();
        updateGalleryStatus();
      }
    }

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
