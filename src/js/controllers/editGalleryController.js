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
      $scope.showUpdateBtn = ($scope.gallery.dateOfUpload && (deletedPhotos.length > 0 || newPhotos.length > 0));
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

    function checkForRemoteChanges() {
      if ($scope.gallery.dateOfUpload) {
        syncService.checkForRemoteChanges($scope.gallery.galleryId);
      }
    }

    function removeDeletedAndNotUploadedPhotos() {
      var
        i,
        promises = [],
        deletedPhotoIds = $filter('notUploadedAndDeletedPhotosFilter')(appDataService.getPhotos(), 'id');

      for (i = 0; i < deletedPhotoIds.length; i++) {
        promises.push(storageService.removePhoto(deletedPhotoIds[i]));
        appDataService.removePhoto(deletedPhotoIds[i]);
      }

      $q.all(promises).then(function () {
        console.log("photos deleted");
        eventService.broadcast('GALLERY-UPDATE');
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
        syncService.uploadLocalChanges();
      } else {
        removeDeletedAndNotUploadedPhotos();
      }
      updateGalleryStatus();
    };

    $scope.onUploadBtnClick = function () {
      if (authService.isAuthorized()) {
        uploadGallery();
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };

    $scope.onShareBtnClick = function () {
      if (authService.isAuthorized()) {
        // check if gallery is uploaded
        if (!$scope.gallery.dateOfUpload) {
          // upload to server
          exportService.uploadGallery();
        }
        $rootScope.go('share-gallery', 'slide-left');
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };

    $scope.onSlideshowBtnClick = function () {
      if ($scope.gallery.photos.length) {
        $rootScope.go('slideshow', 'slide-left');
      }
    };

    $scope.onDeleteSelectionBtnClick = function () {
      removeDeletedAndNotUploadedPhotos();
      updateGalleryStatus();
    };

    $scope.onDeleteGalleryBtnClick = function () {
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

    };

    function init() {
      if ($rootScope.appDataReady) {
        $scope.gallery = appDataService.getGallery();
        updateThumbnails();
        checkForRemoteChanges();
        updateGalleryStatus();
      }
    }

    $scope.$on('GALLERY-UPDATE', function () {
      updateThumbnails();
      updateGalleryStatus();
    });

    $scope.$on('APP-DATA-READY', function () {
      init();
    });

    init();

  }
);
