angular.module(_CONTROLLERS_).controller('createGalleryController', function (
  $scope,
  $rootScope,
  appDataService,
  keyGeneratorService) {

  $scope.pageClass = 'page--create-gallery';
  $scope.showCtrls = true;

  $scope.createGalleryFormData = {};

  $scope.submitForm = function(isValid){
    if (isValid) {
      console.log('galleryTitle', $scope.createGalleryFormData.galleryTitle);
      appDataService.addGallery({
        title: $scope.createGalleryFormData.galleryTitle,
        uploadPassword: keyGeneratorService.generateKey()
      });
      $rootScope.go('edit-gallery', 'slide-left');
    }
  };

  function init() {
    if ($rootScope.appDataReady) {
      $scope.appData = appDataService.getAppData();
      $scope.galleriesLimitReached = appDataService.getNumberOfGalleries() >= appDataService.getGalleriesLimit();
    }
  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
