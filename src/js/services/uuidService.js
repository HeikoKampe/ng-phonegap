angular.module(_SERVICES_).service('uuidService', function () {

  'use strict';

  // simple pseudo uuid generator
  // not really unique but good enough for most collision scenarios

  var
    CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(''),
    LEN = 10;

  function createUUID() {
    var
      uuid = [],
      radix = CHARS.length,
      i;

    for (i = 0; i < LEN; i++) {
      uuid[i] = CHARS[0 | Math.random() * radix];
    }

    return uuid.join('');
  }

  return {
    createUUID: createUUID
  };

});