angular.module(_CONTROLLERS_).controller('slideshowSettingsController', function ($rootScope, $scope, appDataService, eventService) {

var
  prevTransitionEffect = undefined,
  KENBURNS_TRANSITION_DELAY = 20000;


 function init() {
   if ($rootScope.appDataReady) {
     $scope.appSettings = appDataService.getAppSettings();
   }
 }

 $scope.onSettingsChange = function () {
   // set transition delay for ken-burns to fixed value of 10000
   if ($scope.appSettings.slideshowTransitionEffect == 0 && $scope.appSettings.slideshowTransitionEffect !== prevTransitionEffect && prevTransitionEffect !== undefined) {
     $scope.appSettings.slideshowTransitionDelay = KENBURNS_TRANSITION_DELAY;
   }
   prevTransitionEffect = $scope.appSettings.slideshowTransitionEffect;
   eventService.broadcast("GALLERY-UPDATE");
 };


  $scope.$on('APP-DATA-READY', function () {
    init();
  });

  init();

});
