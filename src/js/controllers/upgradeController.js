angular.module(_CONTROLLERS_).controller('upgradeController', function (
  $scope,
  serverAPI,
  appDataService,
  eventService) {


  $scope.pageClass = 'page--upgrade';

  function onUpgradeSuccess(data){
    console.log('upgrade success', data);
    eventService.broadcast('GALLERY-UPDATE');
  }

  function updateLocalSettings (data) {
    appDataService.setAppSettings(data.newSettings);

    return data;
  }

  $scope.onUpgrade1BtnClick = function () {
    var
      settingsUpdate = {
        maxGalleries: 5,
        maxPhotos: 30
      };

    serverAPI.upgrade(appDataService.getUserId(), settingsUpdate)
      .then(updateLocalSettings)
      .then(onUpgradeSuccess)
  };

  $scope.onUpgrade2BtnClick = function () {
    var
      settingsUpdate = {
        allowForeignUploads: true
      };

    serverAPI.upgrade(appDataService.getUserId(), settingsUpdate)
      .then(onUpgradeSuccess)
  };

  function init() {

  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
