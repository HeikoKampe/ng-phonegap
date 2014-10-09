/*
 * config/router.js
 *
 * Defines the routes for the application.
 *
 */
angular.module(_APP_).config([
  '$routeProvider',
  function($routeProvider) {

    // Define routes here.
    $routeProvider
      .when('/', {
        templateUrl: 'html/partials/start/index.html',
        controller: 'startController'
      })
      .when('/home', {
        templateUrl: 'html/partials/home/index.html',
        controller: 'homeController'
      })
      .when('/slideshow', {
        templateUrl: 'html/partials/slideshow/index.html',
        controller: 'slideshowController'
      })
      .when('/edit-gallery', {
        templateUrl: 'html/partials/edit-gallery/index.html',
        controller: 'editGalleryController'
      })
      .when('/create-gallery', {
        templateUrl: 'html/partials/create-gallery/index.html',
        controller: 'createGalleryController'
      })
      .when('/get-gallery', {
        templateUrl: 'html/partials/get-gallery/index.html',
        controller: 'getGalleryController'
      })
      .when('/select-gallery', {
        templateUrl: 'html/partials/select-gallery/index.html',
        controller: 'selectGalleryController'
      })
      .when('/share-gallery', {
        templateUrl: 'html/partials/share-gallery/index.html',
        controller: 'shareGalleryController'
      })
      .when('/settings', {
        templateUrl: 'html/partials/settings/index.html',
        controller: 'settingsController'
      })
      .when('/signin', {
        templateUrl: 'html/partials/auth/signin.html',
        controller: 'authController'
      })
      .when('/login', {
        templateUrl: 'html/partials/auth/login.html',
        controller: 'authController'
      })
      .when('/upload-auth', {
        templateUrl: 'html/partials/auth/upload.html',
        controller: 'authController'
      })
      .otherwise({ redirectTo: '/' });

  }
]);

