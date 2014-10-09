'use strict';

angular.module(_SERVICES_).factory('messageService', function ($rootScope, $q,
                                                               $log,
                                                               $timeout) {

  var
    messages = [],
    MESSAGE_TYPES = {
      PROGRESS: 'progress',
      MESSAGE: 'message',
      DIALOG: 'dialog'
    };

  function getMessages() {
    return messages;
  }

  function startProgressMessage(messageObj, messageOpts) {
    messageObj.type = MESSAGE_TYPES.PROGRESS;
    messageObj.progressIndex = 0;
    //messages.push(messageObj);
    messages.push(messageObj);
  }


  function updateProgressMessage(messageObj, messageOpts) {
    angular.extend(messages[0], messageObj);
  }

  function addProgressResult(result, messageOpts) {
    if (!messages[0].results) {
      messages[0].results = [];
    }
    messages[0].results.push(result);
    delete messages[0].content;

    if (messageOpts && messageOpts.closeMessage) {
      $timeout(function () {
        messages[0].pop();
      }, 3000);
    }
  }

  function endProgressMessage() {
    $timeout(function () {
      messages.pop();
    }, 3000);
  }

  function addProgressMessage(messageObj, messageOpt) {
    if (messages[0]) {
      angular.extend(messages[0], messageObj);
      console.log("message: ", messageObj);
    } else {
      messages.push(messageObj);
    }

    if (messageOpt.closeMessage) {
      $timeout(function () {
        messages.pop();
      }, 3000);
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