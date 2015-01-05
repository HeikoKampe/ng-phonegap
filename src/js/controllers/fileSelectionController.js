'use strict';

angular.module(_CONTROLLERS_).controller('fileSelectionController', function ($scope,
                                                                              $q,
                                                                              $log,
                                                                              appDataService,
                                                                              localImageImportService,
                                                                              eventService,
                                                                              messageService) {


  function onFileSelection() {
    var
      nPhotosInGallery,
      maxPhotos;

    if ($scope.selectedFiles && $scope.selectedFiles.length) {

      nPhotosInGallery = appDataService.getNumberOfPhotos();
      maxPhotos = appDataService.getPhotosLimit();

      if (($scope.selectedFiles.length + nPhotosInGallery) <= maxPhotos) {

        localImageImportService.importLocalImages($scope.selectedFiles)
          .then(function () {
            console.log('import done');
            eventService.broadcast('GALLERY-UPDATE');
            // reset fileList in case user selects the same files again
            // because in that case onFileSelection would not been called
            $scope.selectedFiles = undefined;
          })
          .catch(function (error) {
            if (error.message === 'cancel batch') {
              eventService.broadcast('GALLERY-UPDATE');
            } else {
              throw error;
            }
          });
      } else {
        console.log("reached photos limit");
          messageService.showMessage({
            title: 'Sorry, you selected too many photos.',
            content: 'You can only add ' + (maxPhotos - nPhotosInGallery) + ' more photos to this gallery. ' +
            'Please select less photos, delete already loaded photos or upgrade.'
          });

      }
    }
  }

  // called by fileSelectionDirective
  $scope.showLimitReachedMessage = function () {
    messageService.showMessage({
      title: 'Limit reached',
      content: 'The number of photos is limited to ' + appDataService.getNumberOfPhotos() + '. ' +
      'Remove already loaded photos or upgrade to be able to add new ones.'
    });
  };

  // changed by fileSelectionDirective
  $scope.$watch('selectedFiles', onFileSelection);

});
