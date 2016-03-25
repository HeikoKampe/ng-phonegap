angular.module(_SERVICES_).factory('navigationService', function ($window,
                                                                  $state) {

    'use strict';

    var HISTORY_MAX_LENGTH = 10,
        history = [],
        stateParams = {},
        data = {};

    function addCurrentStateToHistory () {
        history.push($state.current.name);
        if (history.length > HISTORY_MAX_LENGTH) {
            history.shift();
        }
    }

    function go (state, params) {
        addCurrentStateToHistory();
        if (params) {
            stateParams.animationClass = params.animationClass || 'forward';
            if (params.returnState) {
                stateParams.returnState = params.returnState;
            }
        }
        console.log('stateParams', stateParams);
        $state.go(state);
    }

    function back () {
        var prevState = history.pop();

        stateParams.animationClass = 'backward';
        if (prevState) {
            go(prevState);
        } else {
            console.log('history is empty!');
        }
    }

    function goToReturnState () {
        addCurrentStateToHistory();
        if (stateParams.returnState) {
            data.animationClass = 'backward';
            $state.go(stateParams.returnState);
            stateParams.returnState = '';
        } else {
            console.log('no state was set to return to');
        }
    }

    function getPrevState () {
        return history[history.length - 1];
    }

    return {
        stateParams: stateParams,
        go: go,
        back: back,
        goToReturnState: goToReturnState,
        getPrevState: getPrevState
    }

});