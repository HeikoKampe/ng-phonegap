'use strict';

angular.module(_SERVICES_).factory('keyGeneratorService', function () {

  var
    KEY_LENGTH = 4;

  function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low +1) + low);
  }

  function generateKey() {
    var i, key = '';

    // exclude 0 from the set of integers for the first digit
    // because it feels more natural not having a 0 at the beginning of a number
    key = key + randomInt(1,9);

    for (i = 1; i < KEY_LENGTH; i++) {
      key = key + randomInt(0,9);
    }

    return key;
  }

  return {
    generateKey: generateKey
  };

});