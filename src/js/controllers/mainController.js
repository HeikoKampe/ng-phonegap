angular.module(_CONTROLLERS_).controller('mainController', function (
  $rootScope,
  $scope,
  $location,
  $window,
  $log,
  $cordovaFile,
  storageService,
  fileSystemAPI,
  messageService) {

  var
    ctrlsInterval,
    HIDE_CTRLS_DELAY = 2000,
    THUMBNAILS_DIR = 'thumbnails';

  $scope.animationClass = '';
  $scope.ctrlsVisible = true;
  $scope.messages = messageService.getMessages();

  $rootScope.go = function (path, animationClass) {
    $scope.animationClass = animationClass;
    if (path === 'home') {
      $window.history.back();
    } else {
      $location.url(path);
    }
    console.log('class', animationClass);
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

  $rootScope.hideCtrlsAfterDelay = function () {
    ctrlsInterval = $window.setInterval(function () {
      $scope.$apply(function () {
        $rootScope.hideCtrls();
        $window.clearInterval(ctrlsInterval);
      });

    }, HIDE_CTRLS_DELAY)
  };


});
