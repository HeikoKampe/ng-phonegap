angular.module(_CONTROLLERS_).controller('upgradeController', function ($scope,
                                                                        $rootScope,
                                                                        $filter,
                                                                        appConstants,
                                                                        serverAPI,
                                                                        appDataService,
                                                                        eventService,
                                                                        messageService,
                                                                        navigationService) {

    $scope.upgrade1 = {
        maxGalleries: 5,
        maxPhotos: 30
    };

    $scope.upgrade2 = {
        allowForeignUploads: true
    };

    function showLoginNeededMessage () {
        messageService.showMessage({
            title: $filter('translate')('TITLE_LOGIN_NEEDED'),
            content: $filter('translate')('MSG_LOGIN_NEEDED_BEFORE_UPGRADE'),
            button: {
                label: $filter('translate')('NAVI_GO_SIGNIN'),
                action: function () {
                    navigationService.go(appConstants.STATES.SIGNIN, 'slide-left');
                    messageService.closeMessage();
                }
            }
        });
    }

    function onUpgradeSuccess (data) {
        console.log('upgrade success', data);
        eventService.broadcast('GALLERY-UPDATE');
        messageService.showMessage({
            title: 'Thank you for upgrading!',
            content: 'You made me very happy!'
        });
        $scope.appSettings = appDataService.getAppSettings();
    }

    function updateLocalSettings (data) {
        appDataService.setAppSettings(data.newSettings);

        return data;
    }

    $scope.onUpgrade1BtnClick = function () {
        // if logged in
        if (appDataService.getUserToken()) {
            serverAPI.upgrade(appDataService.getUserId(), $scope.upgrade1)
                .then(updateLocalSettings)
                .then(onUpgradeSuccess);
        } else {
            showLoginNeededMessage();
        }
    };

    $scope.onUpgrade2BtnClick = function () {
        // if logged in
        if (appDataService.getUserToken()) {
            serverAPI.upgrade(appDataService.getUserId(), $scope.upgrade2)
                .then(updateLocalSettings)
                .then(onUpgradeSuccess);
        } else {
            showLoginNeededMessage();
        }
    };

    function init () {
        $scope.appSettings = appDataService.getAppSettings();
    }

    $scope.$on('APP-DATA-READY', function () {
        init();
    });

    init();

});
