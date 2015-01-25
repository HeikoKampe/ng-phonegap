angular.module(_CONTROLLERS_).controller('slideshowController', function (
  $scope,
  $rootScope,
  $interval,
  $timeout,
  appDataService,
  fileSystemAPI,
  storageService,
  imageCachingService,
  slideshowTransitionService) {

  var
    slideshowDelay,
    BUFFER_DELTA = 2,
    BUFFER_MAX_LENGTH = 5,
    CTRL_DELAY = 5000,
    photoBufferHistory = [],
    ctrlTimer;

  $scope.pageClass = 'page--slideshow';

  $scope.slideshowInterval = undefined;
  $scope.thumbnails = {};
  $scope.photoBuffer = {};
  $scope.activePhotoId = -1;
  $scope.activePhotoArrayIndex = -1;
  $scope.showThumbnails = false;


  $scope.onThumbnailClick = function (photoId, arrayIndex) {
    setTransitionClass();
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
    setTransitionClass();
    setCtrlTimer();
  };

  $scope.onBottomClick = function () {
    setCtrlTimer();
  };

  function onCtrlTimer () {
    if ($scope.showThumbnails === false) {
      $rootScope.hideCtrls();
    }
  }

  function cancelTimer (timer) {
    if (timer) {
      // cancel running timer
      $timeout.cancel(timer);
    }
  }

  function setCtrlTimer () {
    cancelTimer(ctrlTimer);
    ctrlTimer = $timeout(onCtrlTimer, CTRL_DELAY);
  }

  function getArrayIndexOfNextPhoto(_delta) {
    var delta = (_delta === undefined) ? 1 : _delta;

    return ($scope.activePhotoArrayIndex + delta) % $scope.photos.length;
  }

  function getArrayIndexOfPrevPhoto(_delta) {
    var
      delta = (_delta === undefined) ? 1 : _delta;

    return ((($scope.activePhotoArrayIndex - delta) % $scope.photos.length) + $scope.photos.length) % $scope.photos.length;
  }

  function setTransitionClass () {
    // sets the css class on slideshow images
    // careful: showCtrls is inherited from $rootScope! Refactor?!
    $scope.transitionClass = slideshowTransitionService.getTransitionClass($scope.showCtrls);

  }

  $scope.showNextPhoto = function () {
    setTransitionClass();
    $scope.activePhotoArrayIndex = getArrayIndexOfNextPhoto();
    $scope.activePhotoId = $scope.photos[$scope.activePhotoArrayIndex].id;
    bufferPhotos();
  };

  $scope.showPrevPhoto = function () {
    $scope.activePhotoArrayIndex = getArrayIndexOfPrevPhoto();
    $scope.activePhotoId = $scope.photos[$scope.activePhotoArrayIndex].id;
    bufferPhotos();
  };

  $scope.startSlideshow = function () {
    $rootScope.hideCtrls();
    $scope.showThumbnails = false;
    $scope.showNextPhoto();
    if (!$scope.slideshowInterval) {
      $scope.slideshowInterval = $interval(function () {
        $scope.showNextPhoto();
      }, slideshowDelay);
    }
  };

  $scope.stopSlideshow = function () {
    $interval.cancel($scope.slideshowInterval);
    $scope.slideshowInterval = undefined;
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

  function removePhotoFromSlideshow (photoId) {
    $scope.photos = _.filter($scope.photos, function (photo){
      return photo.id != photoId;
    });
  }

  function loadPhotoInBuffer(photoId) {
    imageCachingService.loadImage(photoId).then(function (imageDataSrc) {
      checkBufferLimit();
      // check buffer again because of loading delay
      if (!$scope.photoBuffer[photoId]) {
        $scope.photoBuffer[photoId] = imageDataSrc;
        photoBufferHistory.push(photoId);
      }
    }, function () {
      console.log('loading photo failed 1', photoId, $scope.photos);
      // if photo is not in cache and cannot re-cached then remove it from slideshow
      removePhotoFromSlideshow(photoId);
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
      photoIdOfNextPhoto = $scope.photos[arrayIndexOfNextPhoto].id;
      photoIdOfPrevPhoto = $scope.photos[arrayIndexOfPrevPhoto].id;
      // buffer image if it is not already in the buffer
      if (!$scope.photoBuffer[photoIdOfNextPhoto]) {
        loadPhotoInBuffer(photoIdOfNextPhoto);
      }
      if (!$scope.photoBuffer[photoIdOfPrevPhoto]) {
        loadPhotoInBuffer(photoIdOfPrevPhoto);
      }
    }
  }

  function loadPhotoAndBufferNeighbours(photoId) {
    if (!$scope.photoBuffer[photoId]) {
      imageCachingService.loadImage(photoId).then(function (imageDataSrc) {
        // check again because of race condition
        if (!$scope.photoBuffer[photoId]) {
          $scope.photoBuffer[photoId] = imageDataSrc;
          photoBufferHistory.push(photoId);
        }
        bufferPhotos();
      }, function () {
        console.log('loading photo failed 2', photoId);
        // if photo is not in cache and cannot re-cached then remove it from slideshow
        removePhotoFromSlideshow(photoId);
      });
    }
  }

  $scope.$on("$routeChangeStart", function (event, next, current) {
    $scope.stopSlideshow();
    cancelTimer(ctrlTimer);
  });

  function init() {
    if ($rootScope.appDataReady) {
      slideshowDelay = appDataService.getAppSettingsItem('slideshowTransitionDelay');
      $scope.photos = angular.copy(appDataService.getPhotos());
      storageService.loadThumbnails().then(function (thumbnails) {
        $scope.thumbnails = thumbnails;
      });
      // load first photo and it´ s neighbours
      loadPhotoAndBufferNeighbours($scope.photos[0].id);
      // autostart slideshow
      $scope.startSlideshow();
    }
  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
