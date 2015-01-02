'use strict';

angular.module(_CONTROLLERS_).controller('fileSelectionController', function ($scope,
                                                                              $q,
                                                                              $log,
                                                                              appDataService,
                                                                              localImageImportService,
                                                                              eventService) {


  function onFileSelection() {
    if ($scope.selectedFiles && $scope.selectedFiles.length) {

      localImageImportService.importLocalImages($scope.selectedFiles)
        .then(function () {
          console.log('import done');
          eventService.broadcast('GALLERY-UPDATE');
          // reset fileList in case user selects the same files again
          // because in that case onFileSelection would not been called
          $scope.selectedFiles = undefined;
        })
        .catch(function (error){
          if (error.message === 'cancel batch') {
            eventService.broadcast('GALLERY-UPDATE');
          } else {
            throw error;
          }
        });
    }
  }

  $scope.$watch('selectedFiles', onFileSelection);

});
