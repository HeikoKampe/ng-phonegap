angular.module(_SERVICES_).service('imageVariantsService', function ($rootScope, $q, imageFactoryService) {

  'use strict';

  var
    IMAGE_VARIANTS = {
      thumbnail: {
        width: 240,
        height: 240,
        quality: 0.7
      },
      main: {
        width: 2048,
        height: 1536,
        quality: 0.9
      },
      main2: {
        width: 1280,
        height: 800,
        quality: 0.9
      }
    },
    IMAGE_FILE_TYPE = 'image/jpeg';

  function createVariants(importObj) {
    var
      deferredPhotoObject = $q.defer(),
      canvasThumb = document.createElement("canvas"),
      canvasMain = document.createElement("canvas"),
      ctxThumb = canvasThumb.getContext("2d"),
      ctxMain = canvasMain.getContext("2d");

    canvasThumb.width = IMAGE_VARIANTS.thumbnail.width;
    canvasThumb.height = IMAGE_VARIANTS.thumbnail.height;

    imageFactoryService.createImageInstance(importObj.photoObj.url, function () {
        var
          //minVal = Math.min(this.width, this.height) * 0.9,
          minVal = Math.min(this.width, this.height) * 1,
          scaleRatio;

        if (this.width > this.height) {
          ctxThumb.drawImage(this, (this.width - minVal) / 2, 0, minVal, minVal, 0, 0, IMAGE_VARIANTS.thumbnail.width, IMAGE_VARIANTS.thumbnail.height);
          scaleRatio = IMAGE_VARIANTS.main.width / this.width;
          canvasMain.width = IMAGE_VARIANTS.main.width;
          canvasMain.height = this.height * scaleRatio;
          ctxMain.drawImage(this, 0, 0, this.width * scaleRatio, this.height * scaleRatio);
        } else {
          ctxThumb.drawImage(this, 0, (this.height - minVal) / 2, minVal, minVal, 0, 0, IMAGE_VARIANTS.thumbnail.width, IMAGE_VARIANTS.thumbnail.height);
          scaleRatio = IMAGE_VARIANTS.main.height / this.height;
          canvasMain.width = this.width * scaleRatio;
          canvasMain.height = IMAGE_VARIANTS.main.height;
          ctxMain.drawImage(this, 0, 0, this.width * scaleRatio, this.height * scaleRatio);
        }
        importObj.photoObj.thumbDataURI = canvasThumb.toDataURL(IMAGE_FILE_TYPE, 0.7);
        importObj.photoObj.mainDataURI = canvasMain.toDataURL(IMAGE_FILE_TYPE, 0.9);
        delete importObj.photoObj.originalDataURI;
        deferredPhotoObject.resolve(importObj);
      },

      function () {
        // on image load error
        importObj.photoObj.status.errors.push(new Error('Unable to load image with url ' + importObj.photoObj.url));
        deferredPhotoObject.reject(importObj);
      }
    );

    return deferredPhotoObject.promise;
  }

  return {
    createVariants: createVariants
  }

});