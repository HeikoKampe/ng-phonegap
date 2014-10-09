angular.module(_CONTROLLERS_).controller('slideshowController', function ($scope, $rootScope, $window, appDataService, fileSystemAPI, storageService) {

  var
    SLIDESHOW_DELAY = 2000,
    BUFFER_DELTA = 2,
    BUFFER_MAX_LENGTH = 5,
    slideshowInterval,
    photoBufferHistory = [];

  $scope.pageClass = 'page--slideshow';


  $scope.thumbnails = {};
  $scope.photoBuffer = {};
  $scope.activePhotoId = -1;
  $scope.activePhotoArrayIndex = 0;
  $scope.gallery = appDataService.getGallery();
  $scope.showThumbnails = false;

  storageService.loadThumbnails().then(function (thumbnails) {
    $scope.thumbnails = thumbnails;
  });

  $scope.onThumbnailClick = function (photoId, arrayIndex) {
    console.log("click", photoId, arrayIndex);
    $scope.stopSlideshow();
    $scope.activePhotoArrayIndex = arrayIndex;
    $scope.activePhotoId = photoId;
    loadPhotoAndBufferNeighbours($scope.activePhotoId);
  };

  $scope.toggleThumbnails = function () {
    $scope.showThumbnails = !$scope.showThumbnails;
  };

  $scope.onCenterClick = function () {
    $rootScope.showCtrls();
    $scope.stopSlideshow();

  };

  function getArrayIndexOfNextPhoto(_delta) {
    var delta = (_delta === undefined) ? 1 : _delta;

    return ($scope.activePhotoArrayIndex + delta) % $scope.gallery.photos.length;
  }

  function getArrayIndexOfPrevPhoto(_delta) {
    var delta = (_delta === undefined) ? 1 : _delta;

    return ((($scope.activePhotoArrayIndex - delta) % $scope.gallery.photos.length) + $scope.gallery.photos.length) % $scope.gallery.photos.length;
  }

  $scope.showNextPhoto = function () {
    $scope.activePhotoArrayIndex = getArrayIndexOfNextPhoto();
    $scope.activePhotoId = $scope.gallery.photos[$scope.activePhotoArrayIndex].id;
    bufferPhotos();
  };

  $scope.showPrevPhoto = function () {
    $scope.activePhotoArrayIndex = getArrayIndexOfPrevPhoto();
    $scope.activePhotoId = $scope.gallery.photos[$scope.activePhotoArrayIndex].id;
    bufferPhotos();
  };

  $scope.startSlideshow = function () {
    $rootScope.hideCtrls();
    $scope.showThumbnails = false;
    if (!slideshowInterval) {
      slideshowInterval = $window.setInterval(function () {
        $scope.$apply(function () {
          $scope.showNextPhoto();
        });

      }, SLIDESHOW_DELAY);
    }
  };

  $scope.stopSlideshow = function () {
    $window.clearInterval(slideshowInterval);
    slideshowInterval = undefined;
  };

  function removeOldestEntryFromBuffer() {
    var oldestPhotoId = photoBufferHistory.shift();

    delete $scope.photoBuffer[oldestPhotoId];
  }

  function checkBufferLimit() {
    if (photoBufferHistory.length >= BUFFER_MAX_LENGTH) {
      removeOldestEntryFromBuffer();
    }
  }

  function loadPhotoInBuffer(photoId) {
    storageService.loadImage(photoId).then(function (imageDataSrc) {
      console.log("loaded", photoId);
      checkBufferLimit();
      // check buffer again because of loading delay
      if (!$scope.photoBuffer[photoId]) {
        $scope.photoBuffer[photoId] = imageDataSrc;
        photoBufferHistory.push(photoId);
      }
    });
  }

  // Preload (buffer) some images ahead and before the currently displayed image
  function bufferPhotos() {
    var
      i,
      arrayIndexOfNextPhoto,
      arrayIndexOfPrevPhoto,
      photoIdOfNextPhoto,
      photoIdOfPrevPhoto;

    for (i = 1; i <= BUFFER_DELTA; i++) {
      arrayIndexOfNextPhoto = getArrayIndexOfNextPhoto(i);
      arrayIndexOfPrevPhoto = getArrayIndexOfPrevPhoto(i);
      photoIdOfNextPhoto = $scope.gallery.photos[arrayIndexOfNextPhoto].id;
      photoIdOfPrevPhoto = $scope.gallery.photos[arrayIndexOfPrevPhoto].id;
      // buffer image if it is not already in the buffer
      if (!$scope.photoBuffer[photoIdOfNextPhoto]) {
        loadPhotoInBuffer(photoIdOfNextPhoto);
      }
      if (!$scope.photoBuffer[photoIdOfPrevPhoto]) {
        loadPhotoInBuffer(photoIdOfPrevPhoto);
      }
    }
    console.log("bufferHistory", photoBufferHistory);
  }

  function loadPhotoAndBufferNeighbours(photoId) {
    if (!$scope.photoBuffer[photoId]) {
      storageService.loadImage(photoId).then(function (imageDataSrc) {
        // check again because of race condition
        if (!$scope.photoBuffer[photoId]) {
          $scope.photoBuffer[photoId] = imageDataSrc;
          photoBufferHistory.push(photoId);
        }
        bufferPhotos();
      });
    }
  }

  $scope.$on("$routeChangeStart", function (event, next, current) {
    $scope.stopSlideshow();
  });

  $scope.activePhotoId = $scope.gallery.photos[$scope.activePhotoArrayIndex].id;
  loadPhotoAndBufferNeighbours($scope.activePhotoId);

  $scope.startSlideshow();
  $rootScope.hideCtrlsAfterDelay();

});
