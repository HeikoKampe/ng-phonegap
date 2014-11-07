angular.module(_CONTROLLERS_).controller('editGalleryController', function ($rootScope, $scope, $log, $filter, appDataService, storageService, exportService, eventService, syncService, authService) {

    $scope.pageClass = 'page--edit-gallery';
    $scope.showCtrls = true;
    $scope.showUploadBtn = false;
    $scope.showUpdateBtn = false;
    $scope.showDeleteBtn = false;

    $scope.gallery = appDataService.getGallery();

    function checkForLocalChanges() {
      var
        deletedPhotos = $filter('photoFilter')($scope.gallery.photos, 'deleted', true, 'id'),
        newPhotos = $filter('notUploadedPhotosFilter')($scope.gallery.photos);

      $scope.showUploadBtn = (!$scope.gallery.dateOfUpload && newPhotos.length > 0);
      $scope.showUpdateBtn = ($scope.gallery.dateOfUpload && (deletedPhotos.length > 0 || newPhotos.length > 0));

      $log.info("$scope.showUpdateBtn", $scope.showUpdateBtn);
    }

    function uploadGallery() {
      exportService.uploadGallery();
    }

    function updateGallery() {
      if ($scope.gallery.dateOfUpload) {
        exportService.uploadGalleryPhotos
          .then(exportService.removeDeletedGalleryPhotos)
          .then(function () {
            eventService.broadcast('GALLERY-UPDATE');
          });
      }
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

    $scope.removePhoto = function () {
      appDataService.markPhotoAsDeleted(this.thumb.id);
    };

    $scope.togglePhoto = function () {
      appDataService.toggleMarkPhotoAsDeleted(this.photo.id);
      checkForLocalChanges();
    };

    $scope.onUpdateBtnClick = function () {
      if ($scope.gallery.dateOfUpload) {
        syncService.uploadLocalChanges();
      } else {
        // if gallery was not not uploaded, just remove deleted photos
        exportService.removeDeletedAndNotUploadedPhotos();
      }
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
        $rootScope.go('share-gallery', 'slide-left');
      } else {
        $rootScope.go('signin', 'slide-left');
      }
    };


    $scope.$on('GALLERY-UPDATE', function () {
      if ($scope.gallery) {
        updateThumbnails();
        checkForLocalChanges();
      } else {
        $scope.gallery = appDataService.getGallery();
        init();
      }
    });


    function init() {
      if ($scope.gallery) {
        updateThumbnails();
        checkForLocalChanges();
//        checkForRemoteChanges();
      }
    }

    init();


  }
);
