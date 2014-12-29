angular.module(_CONTROLLERS_).controller('homeController', function (
  $scope,
  $rootScope,
  appDataService,
  serverAPI,
  galleryImportService,
  keyGeneratorService) {

  $scope.pageClass = 'page--home';
  $scope.showCtrls = false;

  function getGalleries () {
    $scope.galleries = appDataService.getGalleries();
  }

  function calcNumberOfGalleries () {
    if ($scope.galleries) {
      $scope.nGalleries = Object.keys($scope.galleries).length;
    }
  }

  $scope.importGallery = function () {
    serverAPI.getGallery($scope.galleryId).then(function (result) {
      console.log("received gallery from API:", result);
      appDataService.addGallery(result);
      galleryImportService.importRemoteImages(result.photos, $scope.galleryId).then(function (importObjects) {
        console.log("BÄHM", importObjects);
      });
    });
  };

  $scope.editGallery = function (galleryId) {
    appDataService.setActiveGallery(galleryId);
    $rootScope.go('edit-gallery', 'slide-left');
  };

  $scope.createGallery = function (galleryTitle) {
    console.log('galleryTitle', galleryTitle);
    appDataService.addGallery({
        title: galleryTitle,
        uploadKey: keyGeneratorService.generateKey()
      });
    $rootScope.go('edit-gallery', 'slide-left');
  };

  $scope.$on('GALLERY-UPDATE', function () {
    getGalleries();
    calcNumberOfGalleries();
  });

  getGalleries();
  calcNumberOfGalleries();

});
