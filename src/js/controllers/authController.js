angular.module(_CONTROLLERS_).controller('authController', function ($rootScope,
                                                                     $scope,
                                                                     $q,
                                                                     $timeout,
                                                                     appConstants,
                                                                     serverAPI,
                                                                     appDataService,
                                                                     navigationService) {

    $scope.pageClass = 'page--signin';
    $scope.showCtrls = true;

    $scope.uploadPassword = '';
    $scope.uploadAuthSuccess = false;
    $scope.uploadAuthError = false;

    $scope.signinCredentials = {};
    $scope.showSigninFormErrors = false;

    $scope.loginCredentials = {};
    $scope.showLoginFormErrors = false;


    function error (e) {
        console.log("error: ", e.data);
    }

    function onUploadAuthError () {
        $scope.uploadAuthError = true;
        $timeout(function () {
            $scope.uploadAuthError = false;
            $scope.uploadPassword = '';
        }, 1000)
    }

    function onUploadAuthSuccess (apiResult) {
        $scope.uploadAuthSuccess = true;
        appDataService.setUploadToken(apiResult.uploadToken);
        $rootScope.back();
    }

    $scope.signinSubmit = function (isValid) {
        var credentials = {};

        if (isValid) {
            $scope.showSigninFormErrors = false;
            credentials.username = $scope.signinCredentials.username;
            credentials.email = $scope.signinCredentials.email;
            credentials.password = $scope.signinCredentials.password;
            serverAPI.signin(credentials).then(function (result) {
                console.log("signin result:", result);
                setUserData(result);
                navigationService.go(appConstants.STATES.SHAREGALLERY_SHARING, {animationClass: 'forward'});
            }, error);
        } else {
            $scope.showSigninFormErrors = true;
        }
    };


    $scope.uploadAuthSubmit = function () {
        var
            galleryId = appDataService.getActiveGalleryId();

        serverAPI.uploadAuth({'uploadPassword': $scope.uploadPassword, 'galleryId': galleryId})
            .then(onUploadAuthSuccess, onUploadAuthError);

    };

    $scope.test = function () {
        console.log('onNumberPadSubmit');
    };


});
