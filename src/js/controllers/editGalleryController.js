angular.module(_CONTROLLERS_).controller('editGalleryController', function (
    $rootScope,
    $scope,
    $log,
    $filter,
    appDataService,
    storageService,
    exportService,
    eventService,
    syncService,
    authService) {

    $scope.pageClass = 'page--edit-gallery';
    $scope.showCtrls = true;
    $scope.showUploadBtn = false;
    $scope.showUpdateBtn = false;
    $scope.showDeleteBtn = false;
    $scope.showDeleteGalleryBtn = false;

    $scope.gallery = appDataService.getGallery();

    function checkForLocalChanges() {
      var
        deletedPhotos = $filter('photoFilter')($scope.gallery.photos, 'deleted', true, 'id'),
        newPhotos = $filter('notUploadedPhotosFilter')($scope.gallery.photos);

      $scope.highlightSharingBtn = (!$scope.gallery.dateOfUpload && newPhotos.length > 0);
      $scope.showDeleteSelectionBtn = (!$scope.gallery.dateOfUpload && deletedPhotos.length > 0);
      $scope.showUpdateBtn = ($scope.gallery.dateOfUpload && (deletedPhotos.length > 0 || newPhotos.length > 0));
    }

    function uploadGallery() {
      exportService.uploadGallery();
    }

    //function updateGallery() {
    //  if ($scope.gallery.dateOfUpload) {
    //    exportService.uploadGalleryPhotos
    //      .then(exportService.removeDeletedGalleryPhotos)
    //      .then(function () {
    //        eventService.broadcast('GALLERY-UPDATE');
    //      });
    //  }
    //}

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

    function checkForEmptyGallery () {
      // show button for deleting a gallery if there are no photos left
      $scope.showDeleteGalleryBtn = ($scope.gallery.photos.length === 0);
    }

    function removeDeletedAndNotUploadedPhotos() {
      var
        i, deletedPhotos = $filter('notUploadedAndDeletedPhotosFilter')(appDataService.getPhotos());

      for (i = 0; i < deletedPhotos.length; i++) {
        storageService.removePhoto(deletedPhotos[i]);
        appDataService.removePhoto(deletedPhotos[i]);
      }
      if (deletedPhotos.length) {
        eventService.broadcast('GALLERY-UPDATE');
      }
    }

    $scope.removePhoto = function () {
      appDataService.markPhotoAsDeleted(this.thumb.id);
    };

    $scope.togglePhoto = function (photoIndex) {
      appDataService.toggleMarkPhotoAsDeleted(this.photo.id);
      checkForLocalChanges();
    };

    $scope.onUpdateBtnClick = function () {
      if ($scope.gallery.dateOfUpload) {
        syncService.uploadLocalChanges();
      } else {
        removeDeletedAndNotUploadedPhotos();
      }
      checkForEmptyGallery();
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

    $scope.onDeleteSelectionBtnClick = function () {
      removeDeletedAndNotUploadedPhotos();
      checkForEmptyGallery();
    };

    $scope.onDeleteGalleryBtnClick = function () {
      appDataService.deleteGallery();
      if (Object.keys(appDataService.getAppData().galleries).length > 0) {
        $rootScope.go('select-gallery', 'slide-right');
      } else {
        $rootScope.go('/home', 'slide-right');
      }
    };

    $scope.$on('GALLERY-UPDATE', function () {
      if ($scope.gallery) {
        updateThumbnails();
        checkForLocalChanges();
        checkForEmptyGallery();
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
        checkForEmptyGallery();
      }
    }

    init();
  }
);
