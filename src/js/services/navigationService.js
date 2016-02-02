angular.module(_SERVICES_).factory('navigationService', function ($window,
                                                                  $state,
                                                                  $rootScope) {

    'use strict';

    var animationClass = {},
        stateToReturnTo = '',
        data = {};

    function go (state, _animationClass, _stateToReturnTo) {
        data.animationClass = _animationClass;


        //$location.url(path);
        //if (noHistoryEntry) {
        //    $location.replace();
        //}

        if (_stateToReturnTo) {
            stateToReturnTo = _stateToReturnTo;
        }

        console.log('animationClass', animationClass);

        $state.go(state);
    }

    function back () {
        data.animationClass = 'slide-right';

        if (stateToReturnTo) {
            $state.go(stateToReturnTo);
            stateToReturnTo = '';
        } else {
            $window.history.back();
        }
    }

    return {
        data: data,
        go: go,
        back: back
    }

});