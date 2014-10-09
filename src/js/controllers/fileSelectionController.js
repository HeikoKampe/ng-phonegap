'use strict';

angular.module(_CONTROLLERS_).controller('fileSelectionController', function ($scope,
                                                                              $q,
                                                                              $log,
                                                                              appDataService,
                                                                              importService,
                                                                              eventService,
  messageService) {


  function onFileSelection() {
    if ($scope.selectedFiles && $scope.selectedFiles.length) {
      // delete $scope.selectedFiles when fished to enable
      // repeated selection of same files
      messageService.startProgressMessage({title: 'Importing photos'});
      importService.importLocalImages($scope.selectedFiles).then(function () {
        console.log('import done');
        messageService.endProgressMessage();
        eventService.broadcast('GALLERY-UPDATE');
      });
    }
  }

  $scope.$watch('selectedFiles', onFileSelection);

});
