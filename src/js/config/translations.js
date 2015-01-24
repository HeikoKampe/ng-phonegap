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

        TITLE_: '',
        TITLE_NEW: 'Neu',
        TITLE_IMPORT: 'Importieren',
        TITLE_IMPORT_GALLERIES: 'Fotorahmen importieren',
        TITLE_SHOW_GALLERIES: 'Anzeigen',
        TITLE_GALLERIES: 'Fotorahmen',
        TITLE_ALL_GALLERIES: 'Alle Fotorahmen',
        TITLE_SIGNIN: 'Anmelden',
        TITLE_LOGIN: 'Login',
        TITLE_UPGRADE_FEATURES: 'Premium Features',
        TITLE_SETTINGS: 'Einstellungen',
        TITLE_SHARING: 'Teilen',
        TITLE_CHANGE_PASSWORD: 'Passwort ändern',
        TITLE_UPGRADE: 'Premium',


        ACTION_SHARE: 'Teilen',
        ACTION_NEW_GALLERY: 'Fotorahmen erstellen',
        ACTION_ADD: 'hinzufügen',
        ACTION_DELETE: 'entfernen',
        ACTION_CONTINUE: 'Weiter',
        ACTION_ADD_PHOTOS: 'Fotos hinzufügen',
        ACTION_SLIDESHOW: 'Diashow',
        ACTION_UPDATE: 'Aktualisieren',
        ACTION_DELETE_SELECTION: 'Auswahl löschen',
        ACTION_DELETE_GALLERY: 'Fotorahmen löschen',
        ACTION_SEND_EMAIL: 'E-Mail senden',
        ACTION_SEND_SMS: 'SMS senden',
        ACTION_SHOW: 'anzeigen',
        ACTION_HIDE: 'ausblenden',
        ACTION_SHOW_ACCESS_CODE: 'Zugangs-Code anzeigen',
        ACTION_CHANGE_PASSWORD: 'Passwort ändern',



        NAVI_GALLERY: 'Fotorahmen',
        NAVI_SLIDESHOW: 'Diashow',
        NAVI_ACCOUNT: 'Account',
        NAVI_LANGUAGE: 'Sprache',
        NAVI_UPGRADE: 'Premium',
        NAVI_GO_UPGRADE: 'zum Premium Bereich',
        NAVI_GO_LOGIN: 'zum Login',
        NAVI_SHARING_CREDENTIALS: 'Zugangsdaten',
        NAVI_OPTIONS: 'Optionen',


        LABEL_OPTIONS: 'Optionen',
        LABEL_GALLERY: 'Fotorahmen: ',
        LABEL_GALLERY_TITLE: 'Name des Fotorahmens',
        LABEL_YES: 'ja',
        LABEL_NO: 'nein',
        LABEL_ON: 'an',
        LABEL_OFF: 'aus',
        LABEL_FROM: 'von',
        LABEL_TO: 'auf',
        LABEL_ENABLED: 'aktiviert',
        LABEL_DISABLED: 'deaktiviert',
        LABEL_YOUR_USERNAME: 'Ihr Benutzernahme',
        LABEL_USERNAME_AUTHOR: 'Benutzername des Autors',
        LABEL_ACCESS_CODE: 'Zugangs-Code (6-Ziffern)',
        LABEL_ACCESS_CODE_FOTOFRAME: 'Zugangs-Code zu diesem Fotorahmen',
        LABEL_ALLOW_FOREIGN_UPLOADS: 'Gemeinsames bearbeiten',
        LABEL_PASSWORD: 'Passwort',
        LABEL_PIC_USERNAME: 'Wählen Sie einen Benutzernamen',
        LABEL_PIC_PASSWORD: 'Wählen Sie ein Password',
        LABEL_PIC_NEW_PASSWORD: 'Wählen Sie ein neues Password',
        LABEL_EMAIL: 'Ihre E-Mail Adresse',
        LABEL_MAX_GALLERIES: 'Max. Anzahl Fotorahmen',
        LABEL_MAX_PHOTOS: 'Max. Anzahl Fotos pro Fotorahmen',
        LABEL_ALLOW_FOREIGN_UPLOADS_DESCRIPTION: 'Foto-Uploads für andere erlauben.',
        LABEL_DETAILS: 'Details',
        LABEL_SLIDESHOW_DELAY: 'Geschwindigkeit',
        LABEL_LOGIN_WITH_DIFFERENT_USER: 'Mit anderem Benutzer anmelden',
        LABEL_UPGRADE_LIMITS: 'Limits erhöhen',
        LABEL_FEATURE_UPGRADE: 'Premium-Funtionen',




        ERROR_INVALID: 'ungültig',
        ERROR_EMAIL_NOT_FOUND: 'Diese E-Mail Adresse wurde nicht gefunden!',
        ERROR_EMAIL_REQUIRED: 'Eine E-Mail Adresse wird benötigt!',
        ERROR_EMAIL_INVALID_FORMAT: 'Kein gültiges E-Mail format!',
        ERROR_PASSWORD_REQUIRED: 'Ein Passwort wird wird benötigt!!',


        SUCCESS_THANKS_FOR_UPGRADE: 'Vielen Dank für dieses Upgrade!',


        INFO_: '',
        INFO_LIMIT_REACHED: 'Sorry, Sie haben Ihr App Limit erreicht!',
        INFO_GALLERIES_LIMIT: 'Mit der kostenlosen App können Sie genau einen Fotorahmen erstellen und mit anderen teilen.',
        INFO_NEED_MORE: 'Wollen Sie mehr?',
        INFO_ALLOW_FOREIGN_UPLOADS_UNLOCK_INFO: 'Das gemeinsame Bearbeiten ist ein Premium Feature und kann durch den Kauf eines Upgrades freigeschaltet werden.',
        INFO_SIGNIN: 'Bitte melden Sie sich an um, Ihre Fotos mit anderen zu teilen.',
        INFO_LIMIT_UPGRADE: 'Das Limit können Sie im Premium-Bereich erhöhen.',
        INFO_FEATURE_UPGRADE: 'Dieses Feature können Sie im Premium-Bereich aktivieren.',
        INFO_EDIT_GALLERY_INTRO: 'Hier können Sie Fotos hinzufügen ...',
        INFO_CHANGE_PASSWORD: 'Hier können Sie das Passwort ändern.',


        DESC_ALLOW_FOREIGN_UPLOADS: 'Das Hinzufügen und Löschen von Fotos für alle Benutzer des Fotorahmens erlauben.',
        DESC_: '',
        DESC_SHARING: 'Sie können den Fotorahmen mit anderen teilen, indem Sie ihnen den Zugangs-Code (s.u.) und Ihren Benutzernahmen geben.',
        DESC_SUBSCRIBE_STEP_1: 'So gehts (Beispiel): Eine Bekannte von Ihnen hat einen Fotorahmen angelegt und möchte diesen mit Ihnen teilen. Dafür gibt Sie Ihnen Ihren Benutzernamen und einen Zugangs-Code. Sie geben zuerst den Benutzernahmen Ihrer Bekannten ein und dann den Zugangs-Code. Fertig! Viel Spaß!',
        DESC_SUBSCRIBE_STEP_2 : 'Geben Sie nun den Zugangs-Code ein, den Sie vom Autoren des Fotorahmens erhalten haben.',
        DESC_LOGIN: 'Sie haben sich schon einmal angemeldet und einen Fotorahmen angelegt? Dann können Sie sich hier mit Ihren Zugangsdaten anmelden um Ihre existierenden Fotorahmen zu importieren.',
        DESC_CHANGE_PASSWORD: 'Geben Sie dafür zuerst Ihre E-Mail Adresse ein, mit der Sie sich angemeldet haben und ein neues Passwort. Sie erhalten danach einen Sicherheits-Code per E-Mail, mit dem Sie im nächsten Schritt die Änderung authorisieren können.',
        DESC_UPGRADE_ALLOW_FOREIGN_UPLOADS: 'Nach diesem Upgrade können Sie Fotorahmen für die gemeinsame Bearbeitung freigeben. Andere Benutzer können dann ebenfalls Fotos hinzufügen und löschen.',

        MISC_: '',
        SHARING_SEND_CREDENTIALS_VIA_EMAIL: 'Zugangsdaten per E-Mail versenden',
        SHARING_SEND_CREDENTIALS_VIA_SMS: 'Zugangsdaten per SMS versenden',
        SIGNIN_QUESTION: 'Bereits angemeldet?',


      });

    $translateProvider.preferredLanguage('de');

  }
]);