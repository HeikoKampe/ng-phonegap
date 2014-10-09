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
      $scope.showUpdateBtn =
        ((deletedPhotos.length > 0 || newPhotos.length > 0) && !$scope.showUploadBtn) ||
        (deletedPhotos.length > 0 && $scope.showUploadBtn);
    }

    function uploadGallery() {
      exportService.uploadGallery();
    }


    //function updateGallery() {
    //  // if gallery was uploaded to the server, check for remote updates first before applying local changes
    //  if ($scope.gallery.dateOfUpload) {
    //    syncService.getRemoteUpdatesForGallery()
    //      .then($log.info)
    //      .then(exportService.uploadGalleryPhotos)
    //      .then($log.info)
    //      .then(exportService.removeGalleryPhotos)
    //      .then(function () {
    //        eventService.broadcast('GALLERY-UPDATE');
    //      });
    //  } else {
    //    // if gallery was not not uploaded, just remove deleted photos
    //    removeDeletedAndNotUploadedPhotos();
    //    eventService.broadcast('GALLERY-UPDATE');
    //  }
    //}
    //

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
      console.log("this.thumb", this.photo.id);
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
        checkForRemoteChanges();
      }
    }

    init();


  }
);
