angular.module(_SERVICES_).factory('serverAPI', function ($http, $q) {
  'use strict';


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

  function getGalleryByOwnerNameAndKey(galleryOwnerName, galleryKey) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'users/' + galleryOwnerName + '/galleries/' + galleryKey)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getGalleryById(galleryId, accessToken) {
    var
      httpConfig = {},
      deferred = $q.defer();

    // Access tokens are saved as a property of a gallery object and added to the http header
    // by the tokenInterceptor service.
    // When importing a foreign gallery there is no gallery object yet available to save the token to.
    // In this case the token has to be added manually to the header and saved to the gallery object later.

    if (accessToken) {
      httpConfig.headers = {
        'x-access-token2': accessToken
      };
    }

    $http.get(API_BASE_URL + 'galleries/' + galleryId, httpConfig)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getGalleryStatus(galleryId) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'galleries/' + galleryId + '/status')
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function removePhoto(photoId, galleryId, httpConfig) {
    var
      deferred = $q.defer();

    $http.delete(API_BASE_URL + 'galleries/' + galleryId + '/photos/' + photoId, httpConfig)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getSignedImageUrl(galleryId, photoId, httpConfig) {
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
    var
      deferred = $q.defer();

    $http.post(API_BASE_URL + 'login/', credentials)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }


  /**
   * @returns
   */
  //function uploadAuth(credentials) {
  //  var
  //    deferred = $q.defer();
  //
  //  $http.post(API_BASE_URL + 'auth/upload', credentials)
  //    .success(function (data, status, headers, config) {
  //      deferred.resolve(data);
  //    })
  //    .error(function (data, status, headers, config) {
  //      deferred.reject(data);
  //    });
  //
  //  return deferred.promise;
  //}

  function gallerySignin(data) {
    var
      deferred = $q.defer();

    $http.post(API_BASE_URL + 'gallery-signin', data)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }


  function updateUploadPermission(galleryId, permissionSettings) {
    var
      deferred = $q.defer();

    $http.put(API_BASE_URL + 'galleries/' + galleryId + '/settings/upload-permission', permissionSettings)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function logErrorToServer(errorObj) {

    return $http.post(API_BASE_URL + 'logs/', errorObj)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function sendInvitation(data) {

    return $http.post(API_BASE_URL + 'emails/invitation', data)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function checkUsername(username) {
    var
      deferred = $q.defer();

    $http.get(API_BASE_URL + 'users/validate/' + username)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  function getGalleriesOfOwner(userId) {
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

  function requestPasswordPin(userEmail) {
    return $http.post(API_BASE_URL + 'reset-pwd-req', userEmail)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function resetPassword(credentials) {
    return $http.post(API_BASE_URL + 'reset-pwd', credentials)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }

  function upgrade(userId, settingsUpgrade) {
    var
      deferred = $q.defer();

    $http.put(API_BASE_URL + 'users/' + userId + '/settings', settingsUpgrade)
      .success(function (data, status, headers, config) {
        deferred.resolve(data);
      })
      .error(function (data, status, headers, config) {
        deferred.reject(data);
      });

    return deferred.promise;
  }

  return {
    getGalleryByOwnerNameAndKey: getGalleryByOwnerNameAndKey,
    getGalleryById: getGalleryById,
    getGalleriesOfOwner: getGalleriesOfOwner,
    uploadPhoto: uploadPhoto,
    removePhoto: removePhoto,
    createGallery: createGallery,
    deleteGallery: deleteGallery,
    signin: signin,
    login: login,
    gallerySignin: gallerySignin,
    getGalleryStatus: getGalleryStatus,
    updateUploadPermission: updateUploadPermission,
    logErrorToServer: logErrorToServer,
    sendInvitation: sendInvitation,
    getSignedImageUrl: getSignedImageUrl,
    checkUsername: checkUsername,
    requestPasswordPin: requestPasswordPin,
    resetPassword: resetPassword,
    upgrade: upgrade
  }

});