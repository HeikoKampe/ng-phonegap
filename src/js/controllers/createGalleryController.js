angular.module(_CONTROLLERS_).controller('createGalleryController', function (
  $scope,
  $rootScope,
  appDataService,
  keyGeneratorService) {

  $scope.pageClass = 'page--create-gallery';
  $scope.showCtrls = true;

  $scope.createGallery = function (galleryTitle) {
    console.log('galleryTitle', galleryTitle);
    appDataService.addGallery({
      title: galleryTitle,
      uploadPassword: keyGeneratorService.generateKey()
    });
    $rootScope.go('edit-gallery', 'slide-left');
  };


});
