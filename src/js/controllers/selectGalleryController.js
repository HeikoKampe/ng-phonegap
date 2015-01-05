angular.module(_CONTROLLERS_).controller('selectGalleryController', function ($scope,
                                                                              $rootScope,
                                                                              $q,
                                                                              $interval,
                                                                              $filter,
                                                                              appDataService,
                                                                              storageService,
                                                                              authService,
                                                                              syncService) {

  var
    shuffleInterval,
    SHUFFLE_DELAY = 2000,
    N_PREVIEW_PHOTOS = 10,
    shuffleObject = {},
    galleryThumbnails = {};


  $scope.pageClass = 'page--select-gallery';
  $scope.showCtrls = true;
  $scope.galleries = {};
  $scope.previewThumbnails = {};


  function createShuffleObj() {
    var
      i,
      shuffleIndexArray = [];

    for (i = 0; i < N_PREVIEW_PHOTOS; i++) {
      shuffleIndexArray.push(i);
    }

    angular.forEach(galleryThumbnails, function (thumbnails, galleryId) {
      if (thumbnails.length > N_PREVIEW_PHOTOS) {

        shuffleObject[galleryId] = _.shuffle(shuffleIndexArray);
      }
    });

  }

  function shuffle() {
    angular.forEach(shuffleObject, function (indexArray, galleryId) {
      var
        replaceIndex = indexArray.shift(), // index of preview thumbnails which will be replaced
        nextThumb = galleryThumbnails[galleryId].shift(), // get the next thumb of the images which are not visible
        prevThumb = $scope.previewThumbnails[galleryId][replaceIndex]; // get the thumb which will be replaced

      galleryThumbnails[galleryId].push(prevThumb); // push the thumb which will be replaced into the not visible collection
      $scope.previewThumbnails[galleryId][replaceIndex] = nextThumb; // replace the visible thumbnail
      indexArray.push(replaceIndex); // push the shifted index back into the index array (at the end)
    });
  }

  function startShuffling() {
    shuffleInterval = $interval(function () {
      shuffle();
    }, SHUFFLE_DELAY);
  }

  function shuffleThumbnails() {
    createShuffleObj();
    startShuffling();
  }

  function addThumbToPreview(galleryId) {
    var
      thumbnails = galleryThumbnails[galleryId],
      nextThumb = thumbnails.shift();

    if (nextThumb) {
      if ($scope.previewThumbnails[galleryId].length < N_PREVIEW_PHOTOS) {
        $scope.previewThumbnails[galleryId].push(nextThumb);
      } else {
        thumbnails.push($scope.previewThumbnails[galleryId].shift());
        $scope.previewThumbnails[galleryId].push(nextThumb);
      }
    }
  }

  function addThumbsToPreviews() {
    console.log("addThumbsToPreviews");
    angular.forEach(galleryThumbnails, function (thumbnails, galleryId) {
      addThumbToPreview(galleryId);
    });
  }

  function fillPreviewThumbnails() {
    // put thumbs in collection with some delay for a nice visual effect
    $interval(function () {
      addThumbsToPreviews();
    }, 50, 10);
  }

  function loadGalleryThumbnails(galleryId) {
    var
      deferred = $q.defer();

    storageService.loadThumbnails(galleryId).then(function (thumbnails) {
      var thumbId = 0;
      galleryThumbnails[galleryId] = [];
      $scope.previewThumbnails[galleryId] = [];
      // convert received object collection to array collection for easier shuffling
      angular.forEach(thumbnails, function (thumbSrc) {
        var thumbObj = {
          id: thumbId++, // id is needed to prevent ng-repeat getting confused by duplicates
          src: thumbSrc
        };
        galleryThumbnails[galleryId].push(thumbObj);
      });
      deferred.resolve();
    });

    return deferred.promise;
  }


  function createPreviews() {
    var promises = [];

    if ($scope.galleries) {
      angular.forEach($scope.galleries, function (gallery) {
        promises.push(loadGalleryThumbnails(gallery.galleryId));
      });

      $q.all(promises).then(function () {
        fillPreviewThumbnails();
        shuffleThumbnails();
      });
    }
  }

  // mark photos as not viewed yet
  function setPhotosViewStatus(galleryId) {
    var
      photosNeverViewedBefore = $filter('photoFilter')($scope.galleries[galleryId].photos, 'viewStatus', 0),
      photosOnlyViewedOnce = $filter('photoFilter')($scope.galleries[galleryId].photos, 'viewStatus', 1);

    angular.forEach(photosOnlyViewedOnce, function (photo) {
      // mark photo as viewed more than once
      photo.viewStatus = 2;
    });

    angular.forEach(photosNeverViewedBefore, function (photo) {
      // mark photo as viewed once
      photo.viewStatus = 1;
    });

  }

  $scope.onGalleryClick = function (galleryId) {
    appDataService.setActiveGallery(galleryId);
    setPhotosViewStatus(galleryId);
    if (authService.hasEditPermission(galleryId)) {
      $rootScope.go('edit-gallery', 'slide-left');
    } else {
      $rootScope.go('slideshow', 'slide-left');
    }

  };


  function init() {
    if ($rootScope.appDataReady) {
      $scope.galleries = appDataService.getGalleries();
      syncService.checkForRemoteChanges().then(createPreviews);
    }
  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
