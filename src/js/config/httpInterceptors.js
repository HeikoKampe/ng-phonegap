
angular.module(_APP_).config([
  '$httpProvider',
  function ($httpProvider) {

    $httpProvider.interceptors.push('tokenInterceptor');

  }
]);