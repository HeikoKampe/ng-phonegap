angular.module(_SERVICES_).factory('serverAPI', function ($http, $q) {
  'use strict';

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
    var
      deferred = $q.defer();

    $http.post(API_BASE_URL + 'galleries', confObj)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function deleteGallery(galleryId) {
    return $http.delete(API_BASE_URL + 'galleries/' + galleryId)
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
  function uploadPhoto(photoObj, galleryId, httpConfig) {
    var
      deferred = $q.defer();

    $http.post(API_BASE_URL + 'galleries/' + galleryId + '/photo', photoObj, httpConfig)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getGallery(galleryOwnerName, galleryKey) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'users/' + galleryOwnerName + '/galleries/'  + galleryKey)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getGalleryById(galleryId) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'galleries/' + galleryId)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
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

  function removePhoto(photoId, galleryId, httpConfig) {
    return $http.delete(API_BASE_URL + 'galleries/' + galleryId + '/photos/' + photoId, httpConfig)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function getSignedImageUrl (galleryId, photoId, httpConfig) {
    return $http.get(API_BASE_URL + 'galleries/' + galleryId + '/photos/' + photoId, httpConfig)
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
  function login(credentials) {

    return $http.post(API_BASE_URL + 'login/', credentials)
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

  function sendInvitation (data) {

    return $http.post(API_BASE_URL + 'emails/invitation', data)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function validateUsername (username) {
    return $http.get(API_BASE_URL + 'users/validate/' + username)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function getGalleriesOfOwner (userId) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'users/' + userId + '/galleries')
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject({'status': false, 'message': data});
      });

    return deferred.promise;
  }

  function requestPasswordPin (userEmail) {
    return $http.post(API_BASE_URL + 'reset-pwd-req', userEmail)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function resetPassword (credentials) {
    return $http.post(API_BASE_URL + 'reset-pwd', credentials)
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
    getGalleriesOfOwner: getGalleriesOfOwner,
    uploadPhoto: uploadPhoto,
    removePhoto: removePhoto,
    createGallery: createGallery,
    deleteGallery: deleteGallery,
    signin: signin,
    login: login,
    uploadAuth: uploadAuth,
    getGalleryStatus: getGalleryStatus,
    setGallerySettings: setGallerySettings,
    logErrorToServer: logErrorToServer,
    sendInvitation: sendInvitation,
    getSignedImageUrl: getSignedImageUrl,
    validateUsername: validateUsername,
    requestPasswordPin: requestPasswordPin,
    resetPassword: resetPassword
  }

});