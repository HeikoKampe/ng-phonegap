angular.module(_CONTROLLERS_).controller('upgradeController', function (
  $scope,
  $routeParams,
  serverAPI,
  appDataService,
  eventService,
  messageService) {

  $scope.upgrade1 = {
    maxGalleries: 5,
    maxPhotos: 30
  };

  $scope.upgrade2 = {
    allowForeignUploads: true,
    maxPhotos: 15
  };

  function onUpgradeSuccess(data){
    console.log('upgrade success', data);
    eventService.broadcast('GALLERY-UPDATE');
    messageService.showMessage({
      title: 'Thank you for upgrading!',
      content: 'You made me very happy!'
    });
    $scope.appSettings = appDataService.getAppSettings();
  }

  function updateLocalSettings (data) {
    appDataService.setAppSettings(data.newSettings);

    return data;
  }

  $scope.onUpgrade1BtnClick = function () {

    serverAPI.upgrade(appDataService.getUserId(), $scope.upgrade1)
      .then(updateLocalSettings)
      .then(onUpgradeSuccess)
  };

  $scope.onUpgrade2BtnClick = function () {

    serverAPI.upgrade(appDataService.getUserId(), $scope.upgrade2)
      .then(updateLocalSettings)
      .then(onUpgradeSuccess)
  };

  function init() {
    $scope.appSettings = appDataService.getAppSettings();
  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
