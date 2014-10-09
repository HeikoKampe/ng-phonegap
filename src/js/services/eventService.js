angular.module(_SERVICES_).service('eventService', function ($rootScope, $log) {

  'use strict';

  function broadcast(eventName, eventData) {
    $log.info('broadcast: ', eventName, eventData);
    $rootScope.$broadcast(eventName, eventData);
  }

  return {
    broadcast: broadcast
  };

});