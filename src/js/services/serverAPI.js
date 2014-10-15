angular.module(_SERVICES_).factory('serverAPI', function ($http) {
  'use strict';

  function registerClient() {
  }

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
    return $http.post('http://localhost:3000/api/galleries', confObj)
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
    return $http.post('http://localhost:3000/api/galleries/' + galleryId + '/photo', photoObj)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }


  function getGallery(galleryOwnerName, galleryKey) {
    return $http.get('http://localhost:3000/api/users/' + galleryOwnerName + '/galleries/'  + galleryKey)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function getGalleryById(galleryId) {
    return $http.get('http://localhost:3000/api/galleries/' + galleryId)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function getGalleryStatus(galleryId) {
    return $http.get('http://localhost:3000/api/galleries/' + galleryId + '/status')
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false}
      });
  }

  function removePhoto(photoId, galleryId) {
    return $http.delete('http://localhost:3000/api/galleries/' + galleryId + '/photo/' + photoId)
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

    return $http.post('http://localhost:3000/api/signin/', credentials)
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

    return $http.post('http://localhost:3000/api/auth/upload', credentials)
      .success(function (data, status, headers, config) {
        return data;
      })
      .error(function (data, status, headers, config) {
        return {'status': false, 'message': data}
      });
  }


  function setGallerySettings (galleryId, gallerySettings) {

    return $http.post('http://localhost:3000/api/galleries/' + galleryId + '/settings', gallerySettings)
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
    setGallerySettings: setGallerySettings
  }

});