angular.module(_SERVICES_).factory('batchFactoryService', function ($rootScope, $q) {
  'use strict';
  function createBatchObject(batchCollection, galleryId) {
    var
      batchObject = {};

    batchObject = {
      batchStack: [],
      deferred: $q.defer(),
      deferredHttpTimeout: $q.defer(),
      stackLength: batchCollection.length,
      progress: 0,
      failures: 0,
      successes: 0,
      isCancelled: false
    };

    // Fill batch stack with items of passed in collection.
    // This is needed when dealing with a file list as the passed in collection.
    // A file list collection does not behave like an array.
    angular.forEach(batchCollection, function (batchItem) {
      batchObject.batchStack.push(batchItem);
    });

    // abort batch processing
    batchObject.cancel = function () {
      batchObject.isCancelled = true;
      batchObject.deferredHttpTimeout.resolve();
    };

    batchObject.onSuccess = function () {
      console.log('batch success: ', batchObject);
      $rootScope.$evalAsync(function () {
        batchObject.successes++;
        batchObject.progress++;
        // if all batch items are processed, resolve promise
        if (batchObject.stackLength === batchObject.progress) {
          batchObject.deferred.resolve(batchObject);
        }
      });
    };

    batchObject.onError = function (error) {
      console.log('batch error: ', batchObject);

      if (error.message !== 'abort') {
        $log.error(error);
      }

      $rootScope.$evalAsync(function () {
        batchObject.failures++;
        batchObject.progress++;
        // if all batch items are processed, resolve promise
        if (batchObject.stackLength === batchObject.progress) {
          batchObject.deferred.resolve(batchObject);
        }
      });
    };

    batchObject.hasNext = function () {
      return batchObject.batchStack.length > 0;
    };

    // go to next photo in stack
    batchObject.getNext = function () {
      return  batchObject.batchStack.pop();
    };

    return batchObject;
  }


  return {
    createBatchObject: createBatchObject
  };

});

