angular.module(_SERVICES_).factory('slideshowTransitionService', function ($rootScope, appDataService) {
  'use strict';

  var
    KENBURNS_TRANSITION_CLASSES = {
      DIRECTIONS: [
        'trans-ken-burns--to-right',
        'trans-ken-burns--to-left',
        'trans-ken-burns--to-top',
        'trans-ken-burns--to-bottom'
      ],
      ZOOMS: ['trans-ken-burns--zoom-in', 'trans-ken-burns--zoom-out']
    },
    CROSSFADE_TRANSITION_CLASS = 'trans-cross-fade',
    FAST_CROSSFADE_TRANSITION_CLASS = 'trans-cross-fade trans-cross-fade--fast',
    SLIDE_TRANSITION_CLASS = 'trans-slide';

  function getKenBurnsTransitionClass() {
    var transitionClass = 'trans-ken-burns';

    transitionClass += ' ';
    transitionClass += KENBURNS_TRANSITION_CLASSES.DIRECTIONS[Math.floor(Math.random() * KENBURNS_TRANSITION_CLASSES.DIRECTIONS.length)];
    transitionClass += ' ';
    transitionClass += KENBURNS_TRANSITION_CLASSES.ZOOMS[Math.floor(Math.random() * KENBURNS_TRANSITION_CLASSES.ZOOMS.length)];

    return transitionClass;
  }

  function getTransitionClass(ctrlMode) {
    var
      transitionClass;

    // if user is using the slideshow control buttons for navigation
    if (ctrlMode) {
      transitionClass = 'trans-cross-fade trans-cross-fade--fast';
    } else {
      switch (appDataService.getAppSettingsItem('slideshowTransitionEffect')) {
        case 0:
          transitionClass = getKenBurnsTransitionClass();
          break;
        case 1:
          transitionClass = CROSSFADE_TRANSITION_CLASS;
          break;
        case 2:
          transitionClass = SLIDE_TRANSITION_CLASS;
          break;
        default:
          transitionClass = getKenBurnsTransitionClass();
          break;
      }
    }

    console.log('transitionClass: ', transitionClass);
    return transitionClass;
  }

  return {
    getTransitionClass: getTransitionClass
  };

});