angular.module(_SERVICES_).factory('serverAPI', function ($http) {
  'use strict';

//  var API_BASE_URL = 'http://localhost:33000/api/';


  /**
   *
   * @param clientId
   * @param galleries Object {
   *  id: {
   *    changeId: int
   *  }
   * }
   */
  function sync(clientId, galleries) {
  }

  /**
   * @returns serverGallerieId
   */
  function createGallery(confObj) {
    return $http.post(API_BASE_URL + 'galleries', confObj)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  /**
   * @returns serverPhotoId
   */
  function uploadPhoto(photoObj, galleryId) {
    return $http.post(API_BASE_URL + 'galleries/' + galleryId + '/photo', photoObj)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }


  function getGallery(galleryOwnerName, galleryKey) {
    return $http.get(API_BASE_URL + 'users/' + galleryOwnerName + '/galleries/'  + galleryKey)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function getGalleryById(galleryId) {
    return $http.get(API_BASE_URL + 'galleries/' + galleryId)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function getGalleryStatus(galleryId) {
    return $http.get(API_BASE_URL + 'galleries/' + galleryId + '/status')
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function removePhoto(photoId, galleryId) {
    return $http.delete(API_BASE_URL + 'galleries/' + galleryId + '/photo/' + photoId)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }


  /**
   * @returns
   */
  function signin(credentials) {

    return $http.post(API_BASE_URL + 'signin/', credentials)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }


  /**
   * @returns
   */
  function uploadAuth(credentials) {

    return $http.post(API_BASE_URL + 'auth/upload', credentials)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }


  function setGallerySettings (galleryId, gallerySettings) {

    return $http.post(API_BASE_URL + 'galleries/' + galleryId + '/settings', gallerySettings)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function logErrorToServer (errorObj) {

    return $http.post(API_BASE_URL + 'logs/', errorObj)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  return {
    getGallery: getGallery,
    getGalleryById: getGalleryById,
    uploadPhoto: uploadPhoto,
    removePhoto: removePhoto,
    createGallery: createGallery,
    signin: signin,
    uploadAuth: uploadAuth,
    getGalleryStatus: getGalleryStatus,
    setGallerySettings: setGallerySettings,
    logErrorToServer: logErrorToServer
  }

});