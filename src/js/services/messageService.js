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

  $rootScope.message = {};

  function getMessages() {
    return $rootScope.messages;
  }

  function startProgressMessage(messageObj) {
    messageObj.type = MESSAGE_TYPES.PROGRESS;
    messageObj.progressIndex = 0;

      $rootScope.message = messageObj;
  }


  function updateProgressMessage(messageObj) {
    console.log('updateProgressMessage', messageObj);
      angular.extend($rootScope.message, messageObj);
  }

  function addProgressResult(result, messageOpts) {
    if (!$rootScope.message.result) {
      $rootScope.message.results = [];
    }
      $rootScope.message.results.push(result);

    //if (messageOpts && messageOpts.closeMessage) {
    //  $timeout(function () {
    //    $rootScope.message = {};
    //  }, 1000);
    //}
  }

  function endProgressMessage() {
    $timeout(function () {
      $rootScope.message = {};
    }, MESSAGE_HIDE_DELAY);
  }

  function addProgressMessage(messageObj, messageOpt) {
    if ($rootScope.messages[0]) {
      angular.extend($rootScope.messages[0], messageObj);
      console.log("message: ", messageObj);
    } else {
      $rootScope.messages.push(messageObj);
    }

    if (messageOpt.closeMessage) {
      $timeout(function () {
        $rootScope.messages.pop();
      }, 1000);
    }
  }


  function addNoticeMessage() {

  }

  function addDialogMessage() {

  }

  function addMessage(messageObj, _messageOptions) {
    var
      messageType = messageObj.type,
      messageOptions = _messageOptions || {};

    switch (messageType) {
      case MESSAGE_TYPES.PROGRESS:
        addProgressMessage(messageObj, messageOptions);
        break;
      case MESSAGE_TYPES.MESSAGE:
        addNoticeMessage();
        break;
      case MESSAGE_TYPES.DIALOG:
        addDialogMessage();
        break;
      default:
        addNoticeMessage();

    }
  }


  return {
    getMessages: getMessages,
    addMessage: addMessage,
    MESSAGE_TYPES: MESSAGE_TYPES,

    startProgressMessage: startProgressMessage,
    updateProgressMessage: updateProgressMessage,
    addProgressResult: addProgressResult,
    endProgressMessage: endProgressMessage
  }

})
;