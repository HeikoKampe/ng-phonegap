angular.module(_SERVICES_).service('promiseHelperService', function ($timeout) {

  'use strict';

  //wrap resolve/reject in an empty $timeout so it happens within the Angular call stack
  //easier than .apply() since no scope is needed and doesn't error if already within an apply
  function safeResolve(deferral, message) {
    $timeout(function () {
      deferral.resolve(message);
    });
  }

  function safeReject(deferral, message) {
    $timeout(function () {
      deferral.reject(message);
    });
  }

  return {
    safeResolve: safeResolve,
    safeReject: safeReject
  };

});