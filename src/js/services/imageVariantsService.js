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

  /**
   * Detecting vertical squash in loaded image.
   * Fixes a bug which squash image vertically while drawing into canvas for some images.
   * This is a bug in iOS6 devices. This function from https://github.com/stomita/ios-imagefile-megapixel
   *
   */
  function detectVerticalSquash(img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    // search image edge pixel position in case it is squashed vertically.
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
      var alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio===0)?1:ratio;
  }

  /**
   * A replacement for context.drawImage
   * (args are for source and destination).
   */
  function drawImageIOSFix(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio = detectVerticalSquash(img);
    // Works only if whole image is displayed:
    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
    // The following works correct also when only a part of the image is displayed:
    ctx.drawImage(img, sx * vertSquashRatio, sy * vertSquashRatio,
      sw * vertSquashRatio, sh * vertSquashRatio,
      dx, dy, dw, dh );
  }

  function createVariants(importObj) {
    var
      deferred = $q.defer(),
      canvasThumb = document.createElement("canvas"),
      canvasMain = document.createElement("canvas"),
      ctxThumb = canvasThumb.getContext("2d"),
      ctxMain = canvasMain.getContext("2d");

    canvasThumb.width = IMAGE_VARIANTS.thumbnail.width;
    canvasThumb.height = IMAGE_VARIANTS.thumbnail.height;

    // batch import cancelled?
    if (importObj.batchObject && importObj.batchObject.cancelObject.isCancelled) {
      deferred.reject(new Error('cancel batch'));
    } else {
      imageFactoryService.createImageInstance(importObj.photoObj.url, function () {
          var
          //minVal = Math.min(this.width, this.height) * 0.9,
            minVal = Math.min(this.width, this.height),
            sourceX,
            scaleRatio;

          // if landscape
          if (this.width > this.height) {
            sourceX = Math.floor((this.width - minVal) / 2);
            //ctxThumb.drawImage(this, sourceX ,0, minVal, minVal, 0, 0, IMAGE_VARIANTS.thumbnail.width, IMAGE_VARIANTS.thumbnail.height);
            drawImageIOSFix(ctxThumb, this, sourceX ,0, minVal, minVal, 0, 0, IMAGE_VARIANTS.thumbnail.width, IMAGE_VARIANTS.thumbnail.height);
            scaleRatio = Math.floor(IMAGE_VARIANTS.main.width / this.width);
            canvasMain.width = IMAGE_VARIANTS.main.width;
            canvasMain.height = this.height * scaleRatio;
            ctxMain.drawImage(this, 0, 0, this.width * scaleRatio, this.height * scaleRatio);
          // if portrait
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
          deferred.resolve(importObj);
        },

        function () {
          // on image load error
          deferred.reject(new Error('Unable to load image with url ' + importObj.photoObj.url));
        }
      );
    }

    return deferred.promise;
  }

  return {
    createVariants: createVariants
  }

});