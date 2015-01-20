angular.module(_CONTROLLERS_).controller('mainController', function ($rootScope,
                                                                     $scope,
                                                                     $location,
                                                                     $window) {

  var returnLocation = '';

  $rootScope.appDataReady = false;
  $scope.animationClass = '';
  $scope.ctrlsVisible = true;

  $rootScope.go = function (path, animationClass, setReturnLocation) {
    if (setReturnLocation) {
      returnLocation = $location.url();
    }
    $scope.animationClass = animationClass;
    $location.url(path);
    console.log('go: ', path, animationClass);
  };

  $rootScope.back = function (goBackToReturnLocation) {
    $scope.animationClass = 'slide-right';
    if (goBackToReturnLocation && returnLocation){
      $location.url(returnLocation);
      returnLocation = '';
    } else {
      $window.history.back();
    }
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
