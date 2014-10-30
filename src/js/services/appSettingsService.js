angular.module(_SERVICES_).factory('appSettingsService', function () {

  var SETTINGS = {
    N_GALLERIES_MAX: 1,
    N_PHOTOS_MAX: 30,

    APP_DATA_FILE_NAME: 'appData.txt',
    THUMBNAILS_DIR: 'thumbnails'
  };


  function isInLimit (key, value) {
    return (SETTINGS[key] && SETTINGS[key] <= value);
  }

  return {
    SETTINGS: SETTINGS,
    isInLimit: isInLimit
  }
});
