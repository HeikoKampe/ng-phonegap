'use strict';

angular.module(_SERVICES_).factory('messageService', function ($rootScope,
                                                               $q,
                                                               $log,
                                                               $timeout) {

  var
  //message = undefined,
    MESSAGE_HIDE_DELAY = 3000,
    MESSAGE_TYPES = {
      PROGRESS: 'progress',
      MESSAGE: 'message',
      DIALOG: 'dialog'
    };



  function getMessages() {
    return $rootScope.messages;
  }

  function closeMessage () {
    $rootScope.message = {};
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
    messageObj.type = MESSAGE_TYPES.MESSAGE;
    $rootScope.message = messageObj;
    closeMessageWithDelay();
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