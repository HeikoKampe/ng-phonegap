angular.module(_SERVICES_).factory('slideshowTransitionService', function () {
  'use strict';

  var kenBurnsTransitionClasses = {
    directions: [
      'trans-ken-burns--to-right',
      'trans-ken-burns--to-left',
      'trans-ken-burns--to-top',
      'trans-ken-burns--to-bottom'
    ],
    zooms: ['trans-ken-burns--zoom-in', 'trans-ken-burns--zoom-out']
  };

  function getTransitionClass () {
    var transitionClass = 'trans-ken-burns';

    transitionClass += ' ';
    transitionClass +=  kenBurnsTransitionClasses.directions[Math.floor(Math.random()*kenBurnsTransitionClasses.directions.length)];
    transitionClass += ' ';
    transitionClass +=  kenBurnsTransitionClasses.zooms[Math.floor(Math.random()*kenBurnsTransitionClasses.zooms.length)];

    console.log(transitionClass);
    return transitionClass;
  }

  return {
    getTransitionClass: getTransitionClass
  };

});