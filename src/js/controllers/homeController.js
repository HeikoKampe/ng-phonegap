angular.module(_CONTROLLERS_).controller('homeController', function ($scope,
                                                                     $rootScope,
                                                                     appConstants,
                                                                     appDataService,
                                                                     serverAPI,
                                                                     galleryImportService,
                                                                     keyGeneratorService,
                                                                     navigationService) {

    $scope.pageClass = 'page--home';
    $scope.showCtrls = false;

    function getGalleries () {
        $scope.galleries = appDataService.getGalleries();
    }

    function calcNumberOfGalleries () {
        if ($scope.galleries) {
            $scope.nGalleries = Object.keys($scope.galleries).length;
        }
    }

    $scope.importGallery = function () {
        serverAPI.getGallery($scope.galleryId).then(function (result) {
            console.log("received gallery from API:", result);
            appDataService.addGallery(result);
            galleryImportService.importRemoteImages(result.photos, $scope.galleryId).then(function (importObjects) {
                console.log("BÄHM", importObjects);
            });
        });
    };

    $scope.editGallery = function (galleryId) {
        appDataService.setActiveGallery(galleryId);
        navigationService.go(appConstants.STATES.EDITGALLERY, 'slide-left');
    };

    $scope.createGallery = function (galleryTitle) {
        console.log('galleryTitle', galleryTitle);
        appDataService.addGallery({
            title: galleryTitle,
            uploadKey: keyGeneratorService.generateKey()
        });
        navigationService.go(appConstants.STATES.EDITGALLERY, 'slide-left');
    };

    $scope.$on('GALLERY-UPDATE', function () {
        getGalleries();
        calcNumberOfGalleries();
    });

    getGalleries();
    calcNumberOfGalleries();

});
