angular.module(_SERVICES_).factory('batchFactoryService', function ($rootScope, $q, $log) {
  'use strict';

  function createBatchObject(batchCollection, cancelObj) {
    var
      batchObject = {};

    batchObject = {
      batchStack: [],
      deferred: $q.defer(),
      deferredHttpTimeout: $q.defer(),
      stackLength: -1,
      stackIndex: -1,
      progress: 0,
      failures: 0,
      successes: 0,
      cancelObject: cancelObj || {isCancelled:false, deferredHttpTimeout: $q.defer()}
    };

    if (!batchCollection || batchCollection.length === 0) {
      // if batch collection is empty, resolve promise immediately
      batchObject.deferred.resolve();
    }


    // Fill batch stack with items of passed in collection.
    // This is needed when dealing with file lists which do not behave like regular arrays
    // or with object collection
    angular.forEach(batchCollection, function (batchItem) {
      batchObject.batchStack.push(batchItem);
    });

    batchObject.stackLength = batchObject.batchStack.length;

    // abort batch processing
    batchObject.cancel = function () {
      // kill pending requests
      batchObject.cancelObject.deferredHttpTimeout.resolve();
      //batchObject.deferred.reject(new Error('cancel batch'));
      batchObject.cancelObject.isCancelled = true;
      console.log('canceled batch job');
    };

    batchObject.onSuccess = function () {
      $rootScope.$evalAsync(function () {
        batchObject.successes++;
        batchObject.progress++;
        console.log('batch success: ' + batchObject + ':' + batchObject.progress + "/" + batchObject.stackLength);
        // if all batch items are processed, resolve promise
        if (batchObject.stackLength === batchObject.progress) {
          console.log('batch resolve: ' + batchObject);
          batchObject.deferred.resolve(batchObject);
        }
      });
    };

    batchObject.onError = function (error) {
      if (error.message === 'cancel batch') {
        batchObject.deferred.reject(error);
      } else {
        $log.error(error);
      }

      $rootScope.$evalAsync(function () {
        batchObject.failures++;
        batchObject.progress++;
        console.log('batch error: ' + batchObject.progress + "/" + batchObject.stackLength);

        // if all batch items are processed, resolve promise
        if (batchObject.stackLength === batchObject.progress) {
          batchObject.deferred.resolve(batchObject);
        }
      });
    };

    batchObject.hasNext = function () {
      // when batch processing was aborted, do not return the next item
      return batchObject.batchStack.length > batchObject.stackIndex + 1 && batchObject.cancelObject.isCancelled === false;
    };

    // go to next item in stack
    batchObject.getNext = function () {
      batchObject.stackIndex ++;
      return batchObject.batchStack[batchObject.stackIndex];
    };

    return batchObject;
  }

  return {
    createBatchObject: createBatchObject
  };

});

