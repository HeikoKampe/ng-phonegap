'use strict';

angular.module(_SERVICES_).factory('messageService', function ($rootScope,
                                                               $q,
                                                               $log,
                                                               $timeout) {

  var
  //message = undefined,
    MESSAGE_HIDE_DELAY = 2000,
    MESSAGE_TYPES = {
      PROGRESS: 'progress',
      MESSAGE: 'message',
      DIALOG: 'dialog'
    };

/*

var message = {
  type: progress,
  title: 'Main Title',
  subtitle: 'Subtitle',
  prefix: 'uploading ...',
  suffix: 'cancelling',
  info: '',
  results: [],
};

var message = {
  type: message,
  title: 'Main Title',
  content: 'Some content'
}

 */

  function getMessages() {
    return $rootScope.messages;
  }

  function closeMessage () {
    $rootScope.$evalAsync(function() {
      $rootScope.message = {};
    });
  }

  function closeMessageWithDelay() {
    $timeout(function () {
      closeMessage();
    }, MESSAGE_HIDE_DELAY);
  }

  function startProgressMessage(messageObj) {
    $rootScope.message = {};
    $rootScope.message.type = MESSAGE_TYPES.PROGRESS;
    angular.extend($rootScope.message, messageObj);
  }

  function updateProgressMessage(messageObj) {
    if (!$rootScope.message) {
      $rootScope.message = {};
    }
    console.log('updateProgressMessage', messageObj);
    angular.extend($rootScope.message, messageObj);
  }

  function addProgressResult(result) {
    if (!$rootScope.message.result) {
      $rootScope.message.results = [];
    }
    $rootScope.message.results.push(result);
  }

  function endProgressMessage() {
    closeMessageWithDelay();
  }


  function showMessage (messageObj) {
    // sometimes without evalAsync angular will not update the scope
    $rootScope.$evalAsync(function(){
      $rootScope.message = {};
      $rootScope.message.close = closeMessage;
      $rootScope.message.type = MESSAGE_TYPES.MESSAGE;
      angular.extend($rootScope.message, messageObj);
    });

  }


  return {
    MESSAGE_TYPES: MESSAGE_TYPES,

    getMessages: getMessages,
    closeMessage: closeMessage,

    startProgressMessage: startProgressMessage,
    updateProgressMessage: updateProgressMessage,
    addProgressResult: addProgressResult,
    endProgressMessage: endProgressMessage,

    showMessage: showMessage
  }

})
;