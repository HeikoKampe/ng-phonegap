angular.module(_APP_).config([
  '$translateProvider',
  function ($translateProvider) {
    $translateProvider
      .translations('en', {
        HOME_MENU_CREATE_TITLE: 'Create',
        HOME_MENU_CREATE_SUBTITLE: '',
        HOME_MENU_SUBSCRIBE_TITLE: 'Import',
        HOME_MENU_SUBSCRIBE_SUBTITLE: '',
        HOME_MENU_SHOW_TITLE: 'Show',
        HOME_MENU_SHOW_SUBTITLE: '',

        TITLE_SHARING: 'Sharing',
        TITLE_PHOTOFRAME: 'Photo frame',


        BTN_CONTINUE: 'Continue',
        BTN_ADD_PHOTOS: 'Add photos',
        BTN_SLIDESHOW: 'Slideshow',
        BTN_SHARE: 'Share',
        BTN_UPDATE: 'Update',
        BTN_DELETE_SELECTION: 'Delete selection',
        BTN_DELETE_PHOTOFRAME: 'Delete photo frame',

        SHARING_DESCRIPTION: ''
      })
      .translations('de', {
        HOME_MENU_CREATE_TITLE: 'Neu',
        HOME_MENU_CREATE_SUBTITLE: '',
        HOME_MENU_SUBSCRIBE_TITLE: 'Importieren',
        HOME_MENU_SUBSCRIBE_SUBTITLE: '',
        HOME_MENU_SHOW_TITLE: 'Anzeigen',
        HOME_MENU_SHOW_SUBTITLE: '',

        TITLE_SHARING: 'Teilen',
        TITLE_PHOTOFRAME: 'Fotorahmen',
        TITLE_SHARING_CREDENTIALS: 'Zugangsdaten',
        TITLE_SHARING_OPTIONS: 'Optionen',
        TITLE_SELECT_PHOTOFRAME: 'Alle Fotorahmen',
        TITLE_CREATE_NEW: 'Neuen Fotorahmen erstellen',



        LABEL_ENTER_TITLE: 'Name des Fotorahmens',
        LABEL_PHOTO_ADD: 'hinzufügen',
        LABEL_PHOTO_DELETE: 'entfernen',



        INFO_LIMIT_REACHED_TITLE: 'Sorry, Sie haben Ihr App Limit erreicht!',
        INFO_GALLERIES_LIMIT_INFO: 'Mit der kostenlosen App können Sie genau einen Fotorahmen erstellen und mit anderen teilen.',
        INFO_NEED_MORE: 'Wollen Sie mehr?',


        OPTIONS_YES: 'ja',
        OPTIONS_NO: 'nein',
        OPTIONS_ON: 'an',
        OPTIONS_OFF: 'aus',
        OPTIONS_ENABLED: 'aktiviert',
        OPTIONS_DISABLED: 'deaktiviert',

        BTN_CONTINUE: 'Weiter',
        BTN_ADD_PHOTOS: 'Fotos hinzufügen',
        BTN_SLIDESHOW: 'Diashow',
        BTN_SHARE: 'Teilen',
        BTN_UPDATE: 'Aktualisieren',
        BTN_DELETE_SELECTION: 'Auswahl löschen',
        BTN_DELETE_PHOTOFRAME: 'Fotorahmen löschen',
        BTN_SEND_EMAIL: 'E-Mail senden',
        BTN_SEND_SMS: 'SMS senden',

        EDIT_INTRO: 'Intro text',



        SHARING_DESCRIPTION: 'Sie können den Fotorahmen mit anderen teilen, indem Sie ihnen den Zugangs-Code (s.u.) und Ihren Benutzernahmen geben.',
        SHARING_OWNER_USERNAME: 'Ihr Benutzernahme',
        SHARING_ACCESS_KEY: 'Zugangs-Code zu diesem Fotorahmen',
        SHARING_SHOW_ACCESS_KEY: 'anzeigen',
        SHARING_HIDE_ACCESS_KEY: 'ausblenden',
        SHARING_SEND_CREDENTIALS_VIA_EMAIL: 'Zugangsdaten per E-Mail versenden',
        SHARING_SEND_CREDENTIALS_VIA_SMS: 'Zugangsdaten per SMS versenden',
        SHARING_ALLOW_FOREIGN_UPLOADS_LABEL: 'Gemeinsames bearbeiten',
        SHARING_ALLOW_FOREIGN_UPLOADS_DESCRIPTION: 'Das Hinzufügen und Löschen von Fotos für alle Benutzer des Fotorahmens erlauben.',
        SHARING_ALLOW_FOREIGN_UPLOADS_UNLOCK_INFO: 'Das gemeinsame Bearbeiten ist ein Premium Feature und kann durch den Kauf eines Upgrades freigeschaltet werden.',

        SUBSCRIBE_TITLE: 'Fotorahmen importieren',
        SUBSCRIBE_DESCRIPTION: 'Bitte geben Sie den Benutzernahmen des Autors und den Zugangs-Code des Fotorahmens ein.',
        SUBSCRIBE_LABEL_OWNERNAME: 'Benutzername des Autors',
        SUBSCRIBE_LABEL_ACCESS_CODE: 'Zugangs-Code',

        SIGNIN_TITLE: 'Anmelden',
        SIGNIN_DESCRIPTION: 'Bitte melden Sie sich an um, Ihre Fotos mit anderen zu teilen.',
        SIGNIN_QUESTION:  'Bereits angemeldet?',
        SIGNIN_GO_TO_LOGIN:  'zum Login',
        SIGNIN_LABEL_PIC_USERNAME: 'Wählen Sie einen Benutzernamen',
        SIGNIN_LABEL_EMAIL: 'Ihre E-Mail Adresse',
        SIGNIN_LABEL_PASSWORD: 'Wählen Sie ein Password',

        SETTINGS_TITLE: 'Einstellungen',
        SETTINGS_TITLE_GALLERY: 'Fotorahmen',
        SETTINGS_TITLE_SLIDESHOW: 'Diashow',
        SETTINGS_TITLE_ACCOUNT: 'Account',
        SETTINGS_TITLE_LANGUAGE: 'Sprache',
        SETTINGS_TITLE_UPGRADE: 'Upgrade',
        SETTINGS_ACCOUNT_MAX_GALLERIES: 'Max. Anzahl Fotorahmen',
        SETTINGS_ACCOUNT_MAX_PHOTOS: 'Max. Anzahl Fotos pro Fotorahmen',
        SETTINGS_ACCOUNT_ALLOW_FOREIGN_UPLOADS: 'Gemeinsames bearbeiten',
        SETTINGS_ACCOUNT_ALLOW_FOREIGN_UPLOADS_DESCRIPTION: 'Foto-Uploads für andere erlauben.',

        UPGRADE_OPTIONS: 'Upgrade-Optionen',
        UPGRADE_LABEL_GO_TO: 'zu den Upgrades',
        UPGRADE_TYPE_LIMIT: 'Limits-Upgrade',
        UPGRADE_LIMIT_INFO: 'Mit dem Kauf eines Upgrades können Sie die Anzahl erhöhen.',
        UPGRADE_TYPE_FEATURE: 'Feature-Upgrade',
        UPGRADE_FEATURE_INFO: 'Mit dem Kauf eines Upgrades können Sie dieses Feature aktivieren.',
        UPGRADE_LABEL: 'Upgrade',
        UPGRADE_LABEL_FROM: 'von',
        UPGRADE_LABEL_TO: 'auf',


      });

    $translateProvider.preferredLanguage('de');

  }
]);