angular.module(_CONTROLLERS_).controller('createGalleryController', function (
  $scope,
  $rootScope,
  $window,
  fileSystemAPI,
  html5FileSystem,
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
    $window.requestFileSystem(7, 0, function(filesystem){
      console.log('### filesystem', filesystem);
    }, function(){});

    $window.resolveLocalFileSystemURL($window.cordova.file.dataDirectory + 'images/sPgl7CYDsw', function(entry){
      console.log('### entry', entry);
    }, function(error){
      console.log('### entry error', error);
    });

    fileSystemAPI.readAsDataURL('images/sPgl7CYDsw', 4)
      .then(function(dataUrl){
        console.log('111: ', dataUrl);
      }, function(error){
        console.log('111: ', error);
      });

    fileSystemAPI.readFile('images/sPgl7CYDsw', 4)
      .then(function(dataUrl){
        console.log('222: ', dataUrl);
      }, function(error){
        console.log('222: ', error);
      });

    fileSystemAPI.readAsDataURL('thumbnails/sPgl7CYDsw', 4)
      .then(function(dataUrl){
        console.log('333: ', dataUrl);
      }, function(error){
        console.log('333: ', error);
      });

    fileSystemAPI.readFile('thumbnails/sPgl7CYDsw', 4)
      .then(function(dataUrl){
        console.log('444: ', dataUrl);
      }, function(error){
        console.log('444: ', error);
      });

    html5FileSystem.readFileAbsolute($window.cordova.file.dataDirectory + 'images/sPgl7CYDsw')
      .then(function(file){
        console.log('555: ', file);
      }, function(error){
        console.log('555: ', error);
      });

  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();


});
