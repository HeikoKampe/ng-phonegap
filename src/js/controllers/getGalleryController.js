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

  function success(data) {
    console.log("success: ", data);
  }

  function error(e) {
    console.log("error: ", e.message);
  }

  $scope.importGallery = function () {
    serverAPI.getGallery($scope.galleryId).then(function (result) {
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
