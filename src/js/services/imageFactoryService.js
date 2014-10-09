angular.module(_SERVICES_).factory('imageFactoryService', function () {
  'use strict';
  function createImageInstance(imageSrc, success, error) {
    var image = new Image();

    image.setAttribute('crossOrigin','anonymous');
    image.src = imageSrc;
    image.onload = success;
    image.onerror = error;

    return image;
  }

  return {
    createImageInstance: createImageInstance
  };

});