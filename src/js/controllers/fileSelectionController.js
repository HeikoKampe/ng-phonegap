'use strict';

angular.module(_CONTROLLERS_).controller('fileSelectionController', function ($scope,
                                                                              $rootScope,
                                                                              $q,
                                                                              $log,
                                                                              $filter,
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

        messageService.showMessage({
          title: $filter('translate')('TITLE_PHOTOS_LIMIT_REACHED'),
          content: $filter('translate')('MSG_SELECTED_PHOTOS_OVER_LIMIT', {nPhotos: (maxPhotos - nPhotosInGallery)}),
          button: {
            label: $filter('translate')('NAVI_GO_UPGRADE'),
            action: function () {
              $rootScope.go('settings/upgrade', 'slide-left');
              messageService.closeMessage();
            }
          }
        });

      }
    }
  }

  // called by fileSelectionDirective
  $scope.showLimitReachedMessage = function () {

    messageService.showMessage({
      title: $filter('translate')('TITLE_PHOTOS_LIMIT_REACHED'),
      content: $filter('translate')('MSG_PHOTOS_LIMIT_REACHED', {maxPhotos: appDataService.getPhotosLimit()}),
      button: {
        label: $filter('translate')('NAVI_GO_UPGRADE'),
        action: function () {
          $rootScope.go('settings/upgrade', 'slide-left');
          messageService.closeMessage();
        }
      }
    });
  };

  // changed by fileSelectionDirective
  $scope.$watch('selectedFiles', onFileSelection);

});
