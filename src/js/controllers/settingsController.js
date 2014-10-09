angular.module(_CONTROLLERS_).controller('settingsController', function (
  $scope,
  appDataService,
  eventService) {

  $scope.gallerySettings = appDataService.getGallery().settings;

  console.log($scope.gallerySettings);

  $scope.$watchCollection('gallerySettings', function (newValue, oldValue) {
    if (newValue != oldValue) {
      console.log("settings update", $scope.gallerySettings);
      eventService.broadcast("GALLERY-UPDATE");
    }
  });

});
