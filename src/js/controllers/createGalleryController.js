angular.module(_CONTROLLERS_).controller('createGalleryController', function (
  $scope,
  $rootScope,
  appDataService,
  keyGeneratorService) {

  $scope.pageClass = 'page--create-gallery';
  $scope.showCtrls = true;

  $scope.createGalleryForm = {};

  $scope.submitForm = function(isValid){
    if (isValid) {
      console.log('galleryTitle', $scope.createGalleryForm.galleryTitle);
      appDataService.addGallery({
        title: $scope.createGalleryForm.galleryTitle,
        uploadPassword: keyGeneratorService.generateKey()
      });
      $rootScope.go('edit-gallery', 'slide-left');
    }
  };

});
