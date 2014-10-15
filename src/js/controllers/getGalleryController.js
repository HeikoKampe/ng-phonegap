angular.module(_CONTROLLERS_).controller('getGalleryController', function (
  $scope,
  $rootScope,
  appDataService,
  serverAPI,
  importService,
  eventService,
  messageService) {

  $scope.pageClass = 'page--get-gallery';
  $scope.showCtrls = true;
  $scope.galleryKeySegments = [];
  $scope.galleryOwnerName = '';

  function success(data) {
    console.log("success: ", data);
  }

  function error(e) {
    console.log("error: ", e.message);
  }

  $scope.onContinueBtnClick = function () {
    var galleryKey = $scope.galleryKeySegments[0] + $scope.galleryKeySegments[1] + $scope.galleryKeySegments[2];

    serverAPI.getGallery($scope.galleryOwnerName, galleryKey).then(function (result) {
      console.log("received gallery from API:", result);
      appDataService.addGallery(result.data);
      messageService.startProgressMessage({title: 'Importing gallery'});
      importService.importRemoteImages(result.data.photos).then(function () {
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
        $rootScope.go('edit-gallery', 'slide-left');
      });
    });
  };


});
