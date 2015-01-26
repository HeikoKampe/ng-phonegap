angular.module(_CONTROLLERS_).controller('mainController', function ($rootScope,
                                                                     $scope,
                                                                     $location,
                                                                     $window) {

  var returnLocation = '';

  $rootScope.appDataReady = false;
  $scope.animationClass = '';
  $scope.ctrlsVisible = true;

  $rootScope.go = function (path, animationClass, noHistoryEntry) {
    $scope.animationClass = animationClass;
    $location.url(path);
    if (noHistoryEntry) {
      $location.replace();
    }

  };

  $rootScope.back = function () {
    $scope.animationClass = 'slide-right';
    $window.history.back();
  };

  $rootScope.showCtrls = function () {
    $scope.showCtrls = true;
  };

  $rootScope.hideCtrls = function () {
    $scope.showCtrls = false;
  };

  $rootScope.toggleCtrls = function () {
    $scope.showCtrls = !$scope.ctrlsVisible;
  };

});
