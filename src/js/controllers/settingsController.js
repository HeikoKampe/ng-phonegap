//TODO: check if this controller is still needed

angular.module(_CONTROLLERS_).controller('settingsController', function ($scope,
                                                                         $state,
                                                                         appDataService) {

    $scope.pageClass = 'page--settings';
    $scope.$state = $state;
    $scope.showUpgradeInfo = [false, false, false];


    $scope.showUpgradeInfo = function (infoIndex) {
        $scope.showUpgradeInfo[infoIndex] = true;
    };


    function init() {
        $scope.appSettings = appDataService.getAppSettings();
        $scope.userName = appDataService.getUserName();
        console.log('init settings controller', $state);
    }

    $scope.$on('APP-DATA-READY', function () {
        init();
    });

    init();

});
