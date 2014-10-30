angular.module(_SERVICES_).factory('errorLoggingService', function ($log, serverAPI) {
  'use strict';

  var
    LOG_LIMIT_PER_SECOND = 3,
    errorCount = 0,
    timeOfLastLoggedError = new Date().getTime();
  
  function logErrorToServer (errorObj) {
    errorObj.timestamp = new Date().toISOString();
    $log.info('LOG_ERROR_TO_SERVER', errorObj);
    serverAPI.logErrorToServer(errorObj);
  }


  function logError (errorObj) {
    var
      now = new Date().getTime();

    // log an error if previous logged error is older then a second
    if (timeOfLastLoggedError + 1000 < now) { 
      logErrorToServer(errorObj);
      errorCount = 0;
    } else {
      errorCount++;
      // limit logging of rapidly firing errors 
      if (errorCount <= LOG_LIMIT_PER_SECOND) {
        logErrorToServer(errorObj);
      }
    }
    timeOfLastLoggedError = now;
  }

  return {
    logError: logError
  };

});