angular.module(_CONTROLLERS_).controller('loginController', function ($rootScope,
                                                                      $scope,
                                                                      appConstants,
                                                                      serverAPI,
                                                                      appDataService,
                                                                      galleryImportService,
                                                                      eventService,
                                                                      storageService,
                                                                      navigationService) {

    $scope.pageClass = 'page--login';
    $scope.loginCredentials = {};


    function setUserData (userData) {
        appDataService.setUserData({
            userToken: userData.token,
            userId: userData.userId,
            userName: userData.username
        });
    }

    function onLoginError () {
        console.log('LOGIN FAILED');
    }

    function isLoggedInAsDifferentUser (newUserId) {
        var
            currentUserId = appDataService.getUserId();

        return currentUserId !== newUserId;
    }

    function switchToNewUser (apiResult) {
        storageService.deleteAllImages().then(function () {
            appDataService.resetAppData();
            setUserData(apiResult);
            appDataService.setAppSettings(apiResult.userSettings);
            galleryImportService.importAllGalleriesOfUser(apiResult.userId)
                .then(function () {
                    navigationService.go(appConstants.STATES.SELECTGALLERY, {animationClass: 'backward'});
                }, function (error) {
                    console.log('importAllGalleriesOfUser was canceled');
                });
        }, function () {
            throw new Error('delete all images failed');
        });
    }

    $scope.loginSubmit = function (isValid) {
        var
            credentials = {};

        if (isValid) {
            $scope.showLoginFormErrors = false;
            credentials.usernameOrEmail = $scope.loginCredentials.usernameOrEmail;
            credentials.password = $scope.loginCredentials.password;
            serverAPI.login(credentials).then(function (apiResult) {
                console.log("login result:", apiResult);
                if (isLoggedInAsDifferentUser(apiResult.userId)) {
                    switchToNewUser(apiResult);
                } else {
                    appDataService.setUserToken(apiResult.token);
                    $rootScope.back();
                }

            }, onLoginError);
        }
    };


    $scope.resetApp = function () {
        storageService.deleteAppDataFile()
            .then(function () {
                storageService.deleteAllImages();
                storageService.initStorage();
                navigationService.go(appConstants.STATES.HOME, {animationClass: 'backward'});
            }, function (err) {
                console.log('error deleting app data file!');
            });
    };


});
