angular.module(_CONTROLLERS_).controller('getGalleryController', function ($scope,
                                                                           $rootScope,
                                                                           $timeout,
                                                                           appConstants,
                                                                           appDataService,
                                                                           serverAPI,
                                                                           galleryImportService,
                                                                           navigationService) {

    $scope.pageClass = 'page--get-gallery';
    $scope.showCtrls = true;
    $scope.getGalleryStep = 1;
    $scope.galleryCredentials = {
        ownerName: '',
        galleryAccessPassword: ''
    };
    $scope.showForm1Errors = false;
    $scope.showForm2Errors = false;
    $scope.galleryOwnerNameError = false;
    $scope.galleryKeyError = false;


    function onGalleryOwnerError () {
        $scope.galleryOwnerNameError = true;
        $scope.showForm1Errors = true;
    }

    function onGalleryKeyError () {
        $scope.galleryKeyError = true;
        $timeout(function () {
            $scope.galleryKeyError = false;
            $scope.galleryCredentials.galleryKey = '';
        }, 1000)
    }

    $scope.onOwnerNameInputFocus = function () {
        $scope.galleryOwnerNameError = false;
        $scope.showForm1Errors = false;
    };

    $scope.onGetGalleryStep1Submit = function (isFormValid) {
        if (isFormValid) {
            // check if username exists
            serverAPI.checkUsername($scope.galleryCredentials.ownerName)
                .then(function (apiResult) {
                    if (apiResult.foundUserByName) {
                        // proceed
                        $scope.getGalleryStep = 2;
                    } else {
                        onGalleryOwnerError();
                    }
                }, onGalleryOwnerError);
        } else {
            $scope.showForm1Errors = true;
        }
    };

    $scope.onGetGalleryStep2Submit = function () {
        serverAPI.gallerySignin($scope.galleryCredentials)
            .then(function (apiResult) {
                console.log('gallerySignin success', apiResult);
                return galleryImportService.importForeignGallery(apiResult.galleryId, apiResult.token);
            }, onGalleryKeyError)
            .then(function () {
                $scope.showErrorMessage = false;
                navigationService.go(appConstants.STATES.SELECTGALLERY, 'slide-left');
            });

    };


});
