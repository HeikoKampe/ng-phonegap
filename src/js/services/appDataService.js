angular.module(_SERVICES_).service('appDataService', function ($log, $filter, eventService) {

  'use strict';

  var
    appData = {
      userId: 0,
      galleryId: -1,
      activeGalleryId: -1,
      photoId: 0,
      galleries: null
    },
    galleryModel = {
      galleryId: 0,
      ownerId: 0,
      title: "Default Title",
      dateOfUpload: null,
      syncId: 0,
      uploadPassword: '',
      uploadToken: '',
      photos: [],
      settings: {
        allowForeignUploads: false
      }
    };

  function createGalleryId() {
    return ++appData.galleryId;
  }

  function createPhotoId() {
    return ++appData.photoId;
  }

  function setAppData(_appData) {
    appData = _appData;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function getAppData() {
    return appData;
  }

  function getGalleries() {
    return appData.galleries;
  }

  function setGalleries(galleriesData) {
    appData.galleries = galleriesData;
  }

  function getGallery(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId];
  }

  function addGallery(confObj) {
    var newGallery = {};

    newGallery.galleryId = (confObj != undefined && confObj.shortId != undefined) ? confObj.shortId : createGalleryId();
    newGallery.ownerId = (confObj != undefined && confObj.ownerId != undefined) ? confObj.ownerId : appData.userId;
    newGallery.title = (confObj != undefined && confObj.title != undefined) ? confObj.title : undefined;
    newGallery.dateOfUpload = (confObj != undefined && confObj.dateOfUpload != undefined) ? confObj.dateOfUpload : undefined;
    newGallery.syncId = (confObj != undefined && confObj.syncId != undefined) ? confObj.syncId : 0;
    newGallery.uploadPassword = (confObj != undefined && confObj.uploadPassword != undefined) ? confObj.uploadPassword : undefined;
    newGallery.photos = [];
    newGallery.settings = (confObj != undefined && confObj.settings) ? confObj.settings : galleryModel.settings;

    appData.galleries[newGallery.galleryId] = newGallery;
    appData.activeGalleryId = newGallery.galleryId;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function removeGallery() {
    // todo
  }

  function setActiveGallery(galleryId) {
    appData.activeGalleryId = galleryId;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function getActiveGalleryId() {
    return appData.activeGalleryId;
  }

  function resetGalleryData(resultData) {
    if (appData.galleries[resultData.localGalleryId] && !appData.galleries[resultData.remoteGalleryId]) {
      appData.galleries[resultData.remoteGalleryId] = appData.galleries[resultData.localGalleryId];
      appData.galleries[resultData.remoteGalleryId].galleryId = resultData.remoteGalleryId;
      appData.galleries[resultData.remoteGalleryId].dateOfUpload = resultData.dateOfUpload;
      appData.activeGalleryId = resultData.remoteGalleryId;
      delete appData.galleries[resultData.localGalleryId];
    } else {
      throw new Error("error at resetGalleryId");
    }
  }

  function setGallerySettings (settings, _galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    appData.galleries[galleryId].settings = settings;
  }

  function getPhotos(_galleryId) {
    var
      galleryId = (_galleryId === undefined) ? appData.activeGalleryId : _galleryId,
      photos = [];

    if (appData.galleries[galleryId]) {
      photos = appData.galleries[galleryId].photos;
    }

    return photos;
  }

  function addPhotoToGallery(_photoObj, _galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId,
      photoObj = {};

    photoObj.id = (_photoObj != undefined && _photoObj.id != undefined) ? _photoObj.id : undefined;
    photoObj.name = (_photoObj != undefined && _photoObj.name != undefined) ? _photoObj.name : undefined;
    photoObj.lastModifiedDate = (_photoObj != undefined && _photoObj.lastModifiedDate != undefined) ? _photoObj.lastModifiedDate : undefined;
    photoObj.ownerId = (_photoObj != undefined && _photoObj.ownerId != undefined) ? _photoObj.ownerId : undefined;
    photoObj.dateOfUpload = (_photoObj != undefined && _photoObj.dateOfUpload != undefined) ? _photoObj.dateOfUpload : undefined;

    appData.galleries[galleryId].photos.unshift(photoObj);
  }

  function removePhoto(photoId) {
    var photos = appData.galleries[appData.activeGalleryId].photos;

    // ToDo: use lowdash for searching array
    // or use a map for storing images
    angular.forEach(photos, function (value, key) {
      if (value.id === photoId) {
        photos.splice(key, 1);
      }
    });
  }

  function getPhotoArrayIndex(photoId, galleryId) {
    var i, photos;

    photos = getPhotos(galleryId);

    for (i = 0; i < photos.length; i++) {
      if (photos[i].id === photoId) {
        return i;
      }
    }
    return -1;
  }

  function resetPhotoData(uploadObj) {
    var photoArrayIndex = getPhotoArrayIndex(uploadObj.photoObj.id, appData.activeGalleryId);

    if (photoArrayIndex > -1) {
      appData.galleries[appData.activeGalleryId].photos[photoArrayIndex].id = uploadObj.apiResult.remotePhotoId;
      appData.galleries[appData.activeGalleryId].photos[photoArrayIndex].dateOfUpload = uploadObj.apiResult.dateOfUpload;
    } else {
      throw new Error("error at resetPhotoId");
    }
  }

  function getPhotoById(photoId, galleryId) {
    var galleryPhotos = getPhotos(galleryId);

    return $filter('photoFilter')(galleryPhotos, 'id', photoId)[0];
  }

  function markPhotoAsDeleted(photoId, galleryId) {
    var photo = getPhotoById(photoId, galleryId);

    photo.deleted = true;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function toggleMarkPhotoAsDeleted(photoId, galleryId) {
    var photo = getPhotoById(photoId, galleryId);

    photo.deleted = !photo.deleted;
  }

  function getSyncId(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].syncId;
  }

  function setSyncId(newSyncId, _galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    if (!newSyncId) throw new Error('missing Sync-ID');
    appData.galleries[galleryId].syncId = newSyncId;
  }

  function incrSyncId(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    appData.galleries[galleryId].syncId++;
  }

  function resetOwnerIdsOfGalleryPhotos(galleryPhotos, newOwnerId) {
    angular.forEach(galleryPhotos, function (photo) {
      photo.ownerId = newOwnerId;
    });
  }

  function setUserId(userId) {
    var
      oldUserId = appData.userId,
      newUserId = userId;

    if (newUserId != oldUserId) {
      appData.userId = newUserId;
      // set owner ids of own galleries to new user id
      angular.forEach(appData.galleries, function (gallery, key) {
        if (gallery.ownerId === oldUserId) {
          gallery.ownerId = newUserId;
          resetOwnerIdsOfGalleryPhotos(gallery.photos, newUserId);
        }
      });
      eventService.broadcast("GALLERY-UPDATE");
    }
  }

  function getUserId() {
    return appData.userId;
  }

  function setUserToken(token) {
    appData.userToken = token;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function getUserToken() {
    return appData.userToken;
  }

  function setUploadToken(uploadToken, _galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    appData.galleries[galleryId].uploadToken = uploadToken;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function getUploadToken(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    if (galleryId === -1) {
      return '';
    }

    return appData.galleries[galleryId].uploadToken;
  }

  function isOwner(_galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId,
      galleryOwnerId = appData.galleries[galleryId].ownerId,
      userId = appData.userId;

    return galleryOwnerId === userId;
  }


  return {
    setAppData: setAppData,
    getAppData: getAppData,

    getGalleries: getGalleries,
    setGalleries: setGalleries,
    getGallery: getGallery,
    setActiveGallery: setActiveGallery,
    getActiveGalleryId: getActiveGalleryId,
    createGalleryId: createGalleryId,
    addGallery: addGallery,
    resetGalleryData: resetGalleryData,
    getSyncId: getSyncId,
    setSyncId: setSyncId,
    incrSyncId: incrSyncId,
    setGallerySettings: setGallerySettings,

    createPhotoId: createPhotoId,
    getPhotos: getPhotos,
    addPhotoToGallery: addPhotoToGallery,
    removePhoto: removePhoto,
    resetPhotoData: resetPhotoData,
    getPhotoById: getPhotoById,
    markPhotoAsDeleted: markPhotoAsDeleted,
    toggleMarkPhotoAsDeleted: toggleMarkPhotoAsDeleted,

    setUserId: setUserId,
    getUserId: getUserId,
    isOwner: isOwner,
    setUserToken: setUserToken,
    getUserToken: getUserToken,
    setUploadToken: setUploadToken,
    getUploadToken: getUploadToken
  };

});