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

        TITLE_APP: 'SharedPhotoFrame',
        TITLE_NEW: 'Neu',
        TITLE_CREATE_NEW_GALLERY: 'Fotorahmen erstellen',
        TITLE_IMPORT: 'Import',
        TITLE_IMPORT_GALLERY: 'Fotorahmen importieren',
        TITLE_SHOW_GALLERIES: 'Fotorahmen',
        TITLE_GALLERIES: 'Fotorahmen',
        TITLE_ALL_GALLERIES: 'Alle Fotorahmen',
        TITLE_SIGNIN: 'Anmeldung',
        TITLE_LOGIN: 'Login',
        TITLE_UPGRADE_FEATURES: 'Premium Features',
        TITLE_SETTINGS: 'Einstellungen',
        TITLE_SHARING: 'Teilen',
        TITLE_CHANGE_PASSWORD: 'Passwort ändern',
        TITLE_UPGRADE: 'Premium-Bereich',
        TITLE_LANGUAGE: 'Ausgewählte Sprache',
        TITLE_ACCOUNT: 'Benutzerkonto',
        TITLE_PHOTOS_LIMIT_REACHED: 'Foto-Limit',
        TITLE_LOGIN_NEEDED: 'Anmeldung erforderlich',


        ACTION_SHARE: 'Teilen',
        ACTION_NEW: 'Neu',
        ACTION_IMPORT: 'Import',
        ACTION_NEW_GALLERY: 'Fotorahmen erstellen',
        ACTION_ADD: 'hinzufügen',
        ACTION_DELETE: 'entfernen',
        ACTION_CONTINUE: 'weiter',
        ACTION_CLOSE: 'schließen',
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
        ACTION_HIDE_ACCESS_CODE: 'Zugangs-Code ausblenden',
        ACTION_CHANGE_PASSWORD: 'Passwort neu setzen',


        NAVI_GALLERY: 'Fotorahmen',
        NAVI_SLIDESHOW: 'Diashow',
        NAVI_ACCOUNT: 'Benutzerkonto',
        NAVI_LANGUAGE: 'Sprache',
        NAVI_UPGRADE: 'Premium',
        NAVI_GO_UPGRADE: 'zum Premium Bereich',
        NAVI_GO_LOGIN: 'zum Login',
        NAVI_GO_SIGNIN: 'zur Anmeldung',
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
        LABEL_INVALID_ACCESS_CODE: 'Zugangs-Code ist ungültig',
        LABEL_ACCESS_CODE_FOTOFRAME: 'Zugangs-Code zu diesem Fotorahmen',
        LABEL_ALLOW_FOREIGN_UPLOADS: 'Gemeinsames bearbeiten',
        LABEL_PASSWORD: 'Passwort',
        LABEL_PIC_USERNAME: 'Wählen Sie einen Benutzernamen (min. 6 Zeichen)',
        LABEL_PIC_PASSWORD: 'Wählen Sie ein Password (min. 8 Zeichen)',
        LABEL_PIC_NEW_PASSWORD: 'Wählen Sie ein neues Password',
        LABEL_EMAIL: 'Ihre E-Mail Adresse',
        LABEL_USERNAME_OR_EMAIL: 'Ihr Benutzername oder Ihre E-Mail',
        LABEL_MAX_GALLERIES: 'Max. Anzahl eigener Fotorahmen',
        LABEL_MAX_PHOTOS: 'Max. Anzahl Fotos pro Fotorahmen',
        LABEL_ALLOW_FOREIGN_UPLOADS_DESCRIPTION: 'Foto-Uploads für andere erlauben.',
        LABEL_DETAILS: 'Details',
        LABEL_SLIDESHOW_DELAY: 'Geschwindigkeit',
        LABEL_SIGNIN: 'Neu hier? Melden Sie sich jetzt an.',
        LABEL_LOGIN: 'Bereits angemeldet? Gehen Sie zum Login.',
        LABEL_LOGIN_WITH_DIFFERENT_USER: 'Mit anderem Benutzer anmelden',
        LABEL_PASSWORD_FORGOTTEN: 'Sie haben Ihr Passwort verloren?',
        LABEL_UPGRADE_LIMITS: 'Limits erhöhen',
        LABEL_FEATURE_UPGRADE: 'Premium-Funtionen',
        LABEL_HOW_IT_WORKS: 'So geht´s:',
        LABEL_TRANS_KENBURNS: 'Ken-Burns',
        LABEL_TRANS_CROSSFADE: 'Cross-Fade',
        LABEL_TRANS_SLIDE: 'Slide-In/Out',
        LABEL_LANG_DE: 'Deutsch',
        LABEL_LANG_EN: 'Englisch',
        LABEL_LANG_ES: 'Spanisch',
        LABEL_LANG_FR: 'Französisch',


        ERROR_INVALID: 'ungültig',
        ERROR_EMAIL_NOT_FOUND: 'Diese E-Mail Adresse wurde nicht gefunden!',
        ERROR_EMAIL_REQUIRED: 'Geben Sie Ihre E-Mail Adresse ein!',
        ERROR_EMAIL_INVALID_FORMAT: 'Kein gültiges E-Mail format!',
        ERROR_PASSWORD_REQUIRED: 'Ein Passwort wird wird benötigt!!',
        ERROR_USERNAME_REQUIRED: 'Geben Sie einen Benutzernamen ein!',
        ERROR_USERNAME_TOO_SHORT: 'Der Benutzername ist zu kurz!',
        ERROR_USERNAME_TOO_LONG: 'Der Benutzername ist zu lang!',
        ERROR_USERNAME_INVALID: 'Dieser Benutzername wurde nicht gefunden!',
        ERROR_USERNAME_NOT_AVAILABLE: 'Dieser Benutzername ist schon vergeben!',


        SUCCESS_THANKS_FOR_UPGRADE: 'Vielen Dank für dieses Upgrade!',


        INFO_LIMIT_REACHED: 'Sorry, Sie haben Ihr App Limit erreicht!',
        INFO_GALLERIES_LIMIT: 'Mit der kostenlosen App können Sie genau einen Fotorahmen erstellen und mit anderen teilen.',
        INFO_NEED_MORE: 'Wollen Sie mehr?',
        INFO_ALLOW_FOREIGN_UPLOADS_UNLOCK_INFO: 'Das gemeinsame Bearbeiten ist ein Premium Feature und kann durch den Kauf eines Upgrades freigeschaltet werden.',
        INFO_SIGNIN: 'Hier können Sie sich als neuer Nutzer anmelden, um Ihre Fotorahmen mit anderen zu teilen.',
        INFO_SIGNIN_ALREADY: 'Bereits angemeldet?',
        INFO_LOGIN_NO_SIGNIN: 'Neu hier? Dann melden Sie sich bitte zuerst an.',
        INFO_LIMIT_UPGRADE: 'Das Limit können Sie im Premium-Bereich erhöhen.',
        INFO_FEATURE_UPGRADE: 'Dieses Feature können Sie im Premium-Bereich aktivieren.',
        INFO_EDIT_GALLERY_INTRO: 'Ihr Fotorahmen ist leer. Bitte klicken Sie auf "Fotos hinzufügen".',
        INFO_CHANGE_PASSWORD: 'Hier können Sie Ihr Passwort neu setzen.',
        INFO_UPGRADE: 'Hier haben Sie die Möglichkeit mit dem Kauf eines Upgrades den Funktionsumfang der App zu erweitern und deren Weiterentwicklung zu unterstützen.',
        INFO_UPGRADE_LIMITS: 'Erhöhen Sie die Anzahl an eigenen Fotorahmen und die Menge der Fotos je Rahmen um noch mehr Fotos mit anderen zu teilen.',
        INFO_NOT_LOGGED_IN: 'Sie sind zur Zeit nicht angemeldet.',
        INFO_NO_GALLERIES: '<p>Hier finden Sie eine Übersicht über Ihre importierten und eigenen Fotorahmen.</p>' +
        '<p>Klicken Sie auf "Neu" um einen eigenen Fotorahmen anzulegen oder auf "Import", um den Fotorahmen eines Bekannten zu importieren.</p>',

        DESC_ALLOW_FOREIGN_UPLOADS: 'Das Hinzufügen und Löschen von Fotos für alle Benutzer des Fotorahmens erlauben.',
        DESC_SHARING: 'Sie können den Fotorahmen mit anderen teilen, indem Sie ihnen den Zugangs-Code (s.u.) und Ihren Benutzernahmen geben.',
        DESC_SUBSCRIBE_STEP_1: 'So gehts (Beispiel):<br/><br/>Eine Bekannte von Ihnen hat einen Fotorahmen angelegt und möchte diesen mit Ihnen teilen. Dafür gibt Sie Ihnen Ihren Benutzernamen und einen Zugangs-Code.<br/><br/>Sie geben zuerst den Benutzernahmen Ihrer Bekannten ein und dann den Zugangs-Code. Fertig!',
        DESC_SUBSCRIBE_STEP_2: 'Geben Sie nun den Zugangs-Code ein, den Sie vom Autoren des Fotorahmens erhalten haben.',
        DESC_LOGIN: 'Sie haben sich schon einmal angemeldet und einen Fotorahmen angelegt? Dann können Sie sich hier mit Ihren Zugangsdaten anmelden um Ihre existierenden Fotorahmen zu importieren.',
        DESC_CHANGE_PASSWORD: 'Geben Sie dafür zuerst Ihre E-Mail Adresse ein, mit der Sie sich angemeldet haben und ein neues Passwort. Sie erhalten danach einen Sicherheits-Code per E-Mail, mit dem Sie im nächsten Schritt die Änderung authorisieren können.',
        DESC_UPGRADE_ALLOW_FOREIGN_UPLOADS: 'Nach diesem Upgrade können Sie Fotorahmen für die gemeinsame Bearbeitung freigeben. Andere Benutzer dürfen dann ebenfalls Fotos hinzufügen und löschen.',

        MSG_PHOTOS_LIMIT_REACHED: 'Sie haben die max. Anzahl von {{maxPhotos}} Fotos je Rahmen erreicht. Löschen Sie vorhandene Fotos oder erhöhen Sie das Foto-Limit im Premium-Bereich.',
        MSG_SELECTED_PHOTOS_OVER_LIMIT: 'Ihre Auswahl übersteigt das vorhandene Foto-Limit. Bitte wählen Sie max. {{nPhotos}} weitere(s) Fotos aus oder erhöhen das Foto-Limit im Premium-Bereich.',
        MSG_LOGIN_NEEDED_BEFORE_UPGRADE: 'Bitte melden Sie sich zuerst an, bevor Sie ein Upgrade kaufen.',

        MISC_: '',
        SHARING_SEND_CREDENTIALS_VIA_EMAIL: 'Zugangsdaten per E-Mail versenden',
        SHARING_SEND_CREDENTIALS_VIA_SMS: 'Zugangsdaten per SMS versenden',




      });

    $translateProvider.preferredLanguage('de');

  }
]);