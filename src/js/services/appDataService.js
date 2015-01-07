angular.module(_SERVICES_).service('appDataService', function ($rootScope, $log, $filter, eventService, uuidService) {

  'use strict';

  var
    appData = {
      userId: uuidService.createUUID(),
      userName: '',
      galleryId: -1,
      activeGalleryId: -1,
      photoId: 0,
      galleries: null,
      settings: {
        allowForeignUploads: false,
        maxGalleries: 3,
        maxPhotos: 5
      }
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
        allowForeignUploads: false,
        maxPhotos: appData.settings.maxPhotos
      }
    };

  function initAppData() {

  }

  function createGalleryId() {
    return (++appData.galleryId).toString();
  }

  function createPhotoId() {
    return uuidService.createUUID();
  }

  function setAppData(_appData) {
    appData = _appData;
    eventService.broadcast("GALLERY-UPDATE");
  }

  function getAppData() {
    return appData;
  }

  function getAppSettings() {
    return appData.settings;
  }

  function setAppSettings(settings) {
    appData.settings = settings;
  }

  function getGalleries() {
    return appData.galleries;
  }

  function setGalleries(galleriesData) {
    appData.galleries = galleriesData;
  }

  function getNumberOfGalleries () {
    return _.size(appData.galleries);
  }

  function getGalleriesLimit () {
    return appData.settings.maxGalleries;
  }

  function getGallery(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId];
  }

  function addGallery(confObj) {
    var newGallery = {};

    if (!appData.galleries) {
      appData.galleries = {};
    }

    newGallery.galleryId = (confObj != undefined && confObj._id != undefined) ? confObj._id : createGalleryId();
    newGallery.galleryKey = (confObj != undefined && confObj.shortId != undefined) ? confObj.shortId : undefined;
    newGallery.ownerId = (confObj != undefined && confObj.ownerId != undefined) ? confObj.ownerId : appData.userId;
    newGallery.ownerName = (confObj != undefined && confObj.ownerName != undefined) ? confObj.ownerName : appData.userName;
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

  function deleteGallery(_galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    delete appData.galleries[galleryId];
    if (galleryId === appData.activeGalleryId) {
      appData.activeGalleryId = undefined;
    }
    eventService.broadcast("GALLERY-UPDATE");
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
      appData.galleries[resultData.remoteGalleryId].galleryKey = resultData.shortId;
      appData.galleries[resultData.remoteGalleryId].dateOfUpload = resultData.dateOfUpload;
      appData.activeGalleryId = resultData.remoteGalleryId;
      delete appData.galleries[resultData.localGalleryId];
    } else {
      throw new Error("error at resetGalleryId");
    }
  }

  function setGallerySettings(settings, _galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    appData.galleries[galleryId].settings = settings;
  }

  function getGallerySettings(settings, _galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].settings;
  }

  function getGalleryOwnerId(_galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].ownerId;
  }

  function getGalleryTitle(_galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].title;
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
    photoObj.viewStatus = (_photoObj != undefined && _photoObj.viewStatus != undefined) ? _photoObj.viewStatus : undefined;
    photoObj.ownerId = (_photoObj != undefined && _photoObj.ownerId != undefined) ? _photoObj.ownerId : undefined;
    photoObj.dateOfUpload = (_photoObj != undefined && _photoObj.dateOfUpload != undefined) ? _photoObj.dateOfUpload : undefined;

    appData.galleries[galleryId].photos.unshift(photoObj);
  }

  function removePhoto(photoId, _galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId,
      photos = appData.galleries[galleryId].photos;

    _.remove(photos, function (photo) {
      return photo.id === photoId
    });
  }

  function resetPhotoDataAfterUpload(photoObj) {
    var
      galleryId = photoObj.galleryId || appData.activeGalleryId,
      photo = _.find(appData.galleries[galleryId].photos, {'id': photoObj.localId});

    photo.id = photoObj.id;
    photo.dateOfUpload = photoObj.dateOfUpload;
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

  function getNumberOfPhotos(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return getPhotos(galleryId).length;
  }

  function getPhotosLimit(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].settings.maxPhotos;
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

  function resetOwnerOfGalleryPhotos(galleryPhotos, userData) {
    angular.forEach(galleryPhotos, function (photo) {
      photo.ownerId = userData.userId;
      photo.ownerName = userData.userName;
    });
  }

  function resetUserDataForExistingGalleries(oldUserId, userData) {

    // check if user data is really new because this needs only to be done once
    if (userData.userId != oldUserId) {
      // set owner data of own galleries to new user data (received after signin)
      angular.forEach(appData.galleries, function (gallery, key) {
        if (gallery.ownerId === oldUserId) {
          gallery.ownerId = userData.userId;
          gallery.ownerName = userData.userName;
          resetOwnerOfGalleryPhotos(gallery.photos, userData);
        }
      });
    }
  }

  function setUserId(userId) {
    appData.userId = userId;
  }

  function getUserId() {
    return appData.userId;
  }

  function setUserToken(token) {
    appData.userToken = token;
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

    if (!galleryId || galleryId === -1) {
      return '';
    }

    return appData.galleries[galleryId].uploadToken;
  }

  function setUserName(username) {
    appData.userName = username;
  }

  function getUserName() {
    return appData.userName;
  }

  function setUserData(userData) {
    var
      oldUserId = appData.userId;

    setUserId(userData.userId);
    setUserToken(userData.userToken);
    setUserName(userData.userName);
    resetUserDataForExistingGalleries(oldUserId, userData);
    eventService.broadcast("GALLERY-UPDATE");
  }

  function isOwner(_galleryId) {
    var
      galleryId = _galleryId || appData.activeGalleryId,
      galleryOwnerId = appData.galleries[galleryId].ownerId,
      userId = appData.userId;

    return galleryOwnerId === userId;
  }

  function getGalleryKey(_galleryId) {
    var galleryId = _galleryId || appData.activeGalleryId;

    return appData.galleries[galleryId].galleryKey;
  }


  return {
    setAppData: setAppData,
    getAppData: getAppData,
    getAppSettings: getAppSettings,
    setAppSettings: setAppSettings,

    getGalleries: getGalleries,
    setGalleries: setGalleries,
    getNumberOfGalleries: getNumberOfGalleries,
    getGalleriesLimit: getGalleriesLimit,
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
    getGallerySettings: getGallerySettings,
    getGalleryKey: getGalleryKey,
    deleteGallery: deleteGallery,
    getGalleryOwnerId: getGalleryOwnerId,
    getGalleryTitle: getGalleryTitle,

    createPhotoId: createPhotoId,
    getPhotos: getPhotos,
    addPhotoToGallery: addPhotoToGallery,
    removePhoto: removePhoto,
    getPhotoById: getPhotoById,
    resetPhotoDataAfterUpload: resetPhotoDataAfterUpload,
    markPhotoAsDeleted: markPhotoAsDeleted,
    toggleMarkPhotoAsDeleted: toggleMarkPhotoAsDeleted,
    getNumberOfPhotos: getNumberOfPhotos,
    getPhotosLimit: getPhotosLimit,

    setUserId: setUserId,
    getUserId: getUserId,
    isOwner: isOwner,
    setUserToken: setUserToken,
    getUserToken: getUserToken,
    setUploadToken: setUploadToken,
    getUploadToken: getUploadToken,
    setUserName: setUserName,
    getUserName: getUserName,
    setUserData: setUserData
  };

});