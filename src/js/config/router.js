/*
 * config/router.js
 *
 * Defines the routes for the application.
 *
 */
angular.module(_APP_).config([
    '$stateProvider', 'appConstants',
    function ($stateProvider, appConstants) {

        //$locationProvider.html5Mode(true).hashPrefix('!');

        // Define routes here.
        $stateProvider
            .state(appConstants.STATES.START, {
                url: '/start',
                templateUrl: 'html/partials/start/index.html',
                controller: 'startController'
            })
            .state(appConstants.STATES.HOME, {
                url: '/home',
                templateUrl: 'html/partials/home/index.html',
                controller: 'homeController'
            })
            .state(appConstants.STATES.SLIDESHOW, {
                url: '/slideshow',
                templateUrl: 'html/partials/slideshow/index.html',
                controller: 'slideshowController'
            })
            .state(appConstants.STATES.EDITGALLERY, {
                url: '/edit-gallery',
                templateUrl: 'html/partials/edit-gallery/index.html',
                controller: 'editGalleryController'
            })
            .state(appConstants.STATES.CREATEGALLERY, {
                url: '/create-gallery',
                templateUrl: 'html/partials/create-gallery/index.html',
                controller: 'createGalleryController'
            })
            .state(appConstants.STATES.GETGALLERY, {
                url: '/get-gallery',
                templateUrl: 'html/partials/get-gallery/index.html',
                controller: 'getGalleryController'
            })
            .state(appConstants.STATES.SELECTGALLERY, {
                url: '/select-gallery',
                templateUrl: 'html/partials/select-gallery/index.html',
                controller: 'selectGalleryController'
            })
            .state(appConstants.STATES.SHAREGALLERY, {
                url: '/share-gallery',
                abstract: true,
                templateUrl: 'html/partials/share-gallery/index.html',
                controller: 'shareGalleryController'
            })
            .state(appConstants.STATES.SHAREGALLERY_SHARING, {
                url: '/sharing',
                templateUrl: 'html/partials/share-gallery/sharing.html'
            })
            .state(appConstants.STATES.SHAREGALLERY_OPTIONS, {
                url: '/options',
                templateUrl: 'html/partials/share-gallery/options.html'
            })
            //.state('share-gallery', {
            //    url: '/share-gallery/:section1',
            //    templateUrl: 'html/partials/share-gallery/index.html',
            //    controller: 'shareGalleryController'
            //})
            .state(appConstants.STATES.SETTINGS, {
                url: '/settings',
                abstract: true,
                templateUrl: 'html/partials/settings/index.html',
                controller: 'settingsController'
            })
            .state(appConstants.STATES.SETTINGS_ACCOUNT, {
                url: '/account',
                abstract: true,
                template: '<ui-view/>',
                controller: 'settingsAccountController'
            })
            .state(appConstants.STATES.SETTINGS_ACCOUNT_INTRO, {
                url: '/intro',
                templateUrl: 'html/partials/settings/account/index.html'
            })
            .state(appConstants.STATES.SETTINGS_ACCOUNT_RESETPWD, {
                url: '/reset-pwd',
                templateUrl: 'html/partials/settings/account/reset-pwd.html'
            })
            .state(appConstants.STATES.SETTINGS_GALLERY, {
                url: '/gallery',
                templateUrl: 'html/partials/settings/gallery/index.html'
            })
            .state(appConstants.STATES.SETTINGS_INTRO, {
                url: '/intro',
                templateUrl: 'html/partials/settings/intro/index.html'
            })
            .state(appConstants.STATES.SETTINGS_LANGUAGE, {
                url: '/language',
                templateUrl: 'html/partials/settings/language/index.html'
            })
            .state(appConstants.STATES.SETTINGS_SLIDESHOW, {
                url: '/slideshow',
                templateUrl: 'html/partials/settings/slideshow/index.html',
                controller: 'slideshowSettingsController'
            })
            .state(appConstants.STATES.SETTINGS_UPGRADE, {
                url: '/upgrade',
                abstract: true,
                template: '<ui-view/>',
                controller: 'upgradeController'
            })
            .state(appConstants.STATES.SETTINGS_UPGRADE_INTRO, {
                url: '/intro',
                templateUrl: 'html/partials/settings/upgrade/index.html'
            })
            .state(appConstants.STATES.SETTINGS_UPGRADE_FEATURE1, {
                url: '/feature-1',
                templateUrl: 'html/partials/settings/upgrade/feature-1.html'
            })
            .state(appConstants.STATES.SETTINGS_UPGRADE_LIMITS1, {
                url: '/limits-1',
                templateUrl: 'html/partials/settings/upgrade/limits-1.html'
            })
            .state(appConstants.STATES.SIGNIN, {
                url: '/signin',
                templateUrl: 'html/partials/signin/index.html',
                controller: 'signinController'
            })
            .state(appConstants.STATES.LOGIN, {
                url: '/login',
                templateUrl: 'html/partials/login/index.html',
                controller: 'loginController'
            })
            .state(appConstants.STATES.UPLOADAUTH, {
                url: '/upload-auth',
                templateUrl: 'html/partials/auth/upload.html',
                controller: 'authController'
            })
            .state(appConstants.STATES.INVITE, {
                url: '/invite',
                templateUrl: 'html/partials/invite/index.html',
                controller: 'inviteController'
            })
            .state(appConstants.STATES.RESETPWD, {
                url: '/reset-pwd',
                templateUrl: 'html/partials/reset-pwd/index.html',
                controller: 'resetPasswordController'
            });

    }
]);

