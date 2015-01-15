angular.module(_CONTROLLERS_).controller('settingsController', function (
  $scope,
  $routeParams,
  appDataService,
  eventService) {

  $scope.pageClass = 'page--settings';
  $scope.settingsSection1 = $routeParams.section1;
  $scope.settingsSection2 = $routeParams.section2;

  $scope.onUpgradeBtnClick = function () {

  };

  function init() {
    $scope.appSettings = appDataService.getAppSettings();
    $scope.userName = appDataService.getUserName();
    console.log('init settings controller', $routeParams);
  }

  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
