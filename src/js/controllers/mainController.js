angular.module(_CONTROLLERS_).controller('mainController', function ($rootScope,
                                                                     $scope,
                                                                     $window,
                                                                     appConstants,
                                                                     navigationService) {


    $rootScope.showCtrls = function () {
        $scope.showCtrls = true;
    };

    $rootScope.hideCtrls = function () {
        $scope.showCtrls = false;
    };

    $rootScope.toggleCtrls = function () {
        $scope.showCtrls = !$scope.ctrlsVisible;
    };

    function init () {
        $scope.navigationService = navigationService;
        $rootScope.appConstants = appConstants;
        $rootScope.appDataReady = false;
        $scope.ctrlsVisible = true;
    }

    init();

});
