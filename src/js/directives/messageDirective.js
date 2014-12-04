'use strict';

angular.module(_DIRECTIVES_).directive('messageDirective', function ($compile, $http, messageService) {

  var
    TEMPLATE_BASE_PATH = 'html/partials/global/';

  function getTemplateUrl (messageType) {
    // default template
     var templateUrl = '';

    switch (messageType) {
      case messageService.MESSAGE_TYPES.PROGRESS:
        templateUrl = TEMPLATE_BASE_PATH + 'progress.html';
        break;
      case messageService.MESSAGE_TYPES.MESSAGE:
        templateUrl = TEMPLATE_BASE_PATH + 'message.html';
        break;
      case messageService.MESSAGE_TYPES.DIALOG:
        templateUrl = TEMPLATE_BASE_PATH + 'dialog.html';
        break;
      default:
        templateUrl = TEMPLATE_BASE_PATH + 'message.html'

    }

    return templateUrl;
  }

  return {
    restrict: 'A',
    replace: true,
    transclude: true,
    scope: {
      message: '='
    },

    link: function (scope, element, attrs) {
      var templateUrl = getTemplateUrl(attrs.messageType);

      $http.get(templateUrl).then(function (result) {
        element.html(result.data);
        $compile(element.contents())(scope);
      });

    }
  };

});
