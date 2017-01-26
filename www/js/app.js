// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "starter" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of "requires"
// "starter.controllers" is found in controllers.js
angular.module("softphone", ["ionic", "softphone.controllers", "pascalprecht.translate"])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $translateProvider) {

    $ionicConfigProvider.backButton.previousTitleText(false).text("");
    $stateProvider

        .state("intro", {
        url: "/",
        templateUrl: "intro.html",
        controller: "IntroCtrl"
    })

    .state("app", {
        url: "/app",
        abstract: true,
        templateUrl: "menu.html",
        controller: "AppCtrl"
    })

    .state("app.phone", {
        url: "/phone",
        views: {
            "menuContent": {
                templateUrl: "phone.html",
                controller: "PhoneCtrl"
            }
        }
    })

    .state("app.chatContact", {
        url: "/chatContact/:name",
        views: {
            "menuContent": {
                templateUrl: "chatContact.html",
                controller: "newContactCtrl"
            }
        }
    })

    .state("app.contacts", {
        url: "/contacts",
        views: {
            "menuContent": {
                templateUrl: "contacts.html",
                controller: "ContactsCtrl"
            }
        }
    })

    .state("app.history", {
        url: "/history",
        views: {
            "menuContent": {
                templateUrl: "history.html",
                controller: "HistoryCtrl"
            }
        }
    })

    .state("app.chat", {
        url: "/chat",
        views: {
            "menuContent": {
                templateUrl: "chat.html",
                controller: "ChatCtrl"
            }
        }


    })

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise("/app/phone");

    $translateProvider.translations("en", {

        // INTRO Translated Labels
        "INTRO_PREVIOUS": "Previous Slide",
        "INTRO_NEXT": "Next",
        "INTRO_START": "Start using uPhone",
        "INTRO_LANGUAGE": "Language",
        "INTRO_WELCOME_HEADER": "Welcome to uPhone!",
        "INTRO_WELCOME_DESCRIPTION": "uContact Phone for Android",
        "INTRO_LANDING_FIRST": "Go to the Next Slide",
        "INTRO_LANDING_SECOND": "To get Started!",
        "INTRO_NETWORK": "Please enter network information",
        "INTRO_NETWORK_HOST": "Telephony Server",
        "INTRO_NETWORK_NUMBER": "Phone Number",
        "INTRO_NETWORK_PASS": "Password",
        "INTRO_LAST_READY": "You're ready to Go!",
        "INTRO_LAST_INSTRUCTION": "Just click on the button below to start uContact Phone",
        "INTRO_LAST_BUTTON": "Start uPhone !",

        // PHONE Translated Labels
        "PHONE_PLACEHOLDER_AREA": "Type to Call...",
        "PHONE_STATUS_NOTREGISTERED": "Not Registered...",
        "PHONE_STATUS_REGISTERED": "Registered...",
        "PHONE_STATUS_CONNECTING": "Connecting...",
        "PHONE_STATUS_CONNECTED": "Connected...",
        "PHONE_STATUS_DISCONNECTED": "Disconnected...",
        "PHONE_STATUS_UNREGISTERED": "Unregistered...",
        "PHONE_STATUS_REGISTRATIONFAILED": "Registration Failed...",
        "PHONE_STATUS_STARTING": "Starting...",
        "PHONE_CALLSTATUS_PEERCONNECTION": "Peerconnection...",
        "PHONE_CALLSTATUS_CONNECTING": "Connecting...",
        "PHONE_CALLSTATUS_SENDING": "Sending...",
        "PHONE_CALLSTATUS_PROGRESS": "Ringing...",
        "PHONE_CALLSTATUS_ACCEPTING": "Accepted...",
        "PHONE_CALLSTATUS_SENDING": "Sending...",
        "PHONE_CALLSTATUS_CONFIRMED": "Confirmed...",
        "PHONE_CALLSTATUS_HOLD": "Hold...",
        "PHONE_CALLSTATUS_UNHOLD": "Unhold...",
        "PHONE_CALLSTATUS_MUTED": "Muted...",
        "PHONE_CALLSTATUS_UNMUTED": "Unmuted...",
        "PHONE_CALLSTATUS_REINVITE": "Reinvite...",
        "PHONE_CALLSTATUS_UPDATE": "Update...",
        "PHONE_CALLSTATUS_REFER": "Refer...",
        "PHONE_CALLSTATUS_REPLACES": "Replaces...",

        // Menu Translated Labels
        "MENU_PHONE": "Phone",
        "MENU_CONTACTS": "Contacts",
        "MENU_HISTORY": "History",
        "MENU_CHAT": "Chat",
        "MENU_SETTINGS": "Settings",

        // Contacts Translated Labels
        "CONTACTS_TITLE": "Contacts",
        "CONTACTS_OFFLINE": "Offline Contacts",
        "CONTACTS_ONLINE": "Online Contacts",
        "CONTACTS_LOCAL": "Local Contacts",
        "CONTACTS_NEWTITLE": "New Contact",
        "CONTACTS_NAME": "Name",
        "CONTACTS_PHONENUMBER": "Phone Number",
        "CONTACTS_BUTTONSAVE": "Save",

        // History Translated Labels
        "HISTORICAL_TITLE": "Historical",

        // Chat Translated Labels
        "CHAT_TITLE": "Chats",

        // ChatContact Translated Labels
        "CHATCONTACT_PLACEHOLDER": "Type your Message...",

        // Settings Translated Labels
        "SETTINGS_TITLE": "Settings",
        "SETTINGS_BUTTON": "Save",
        "SETTINGS_CERRAR": "Cerrar",
        "SETTINGS_THEME": "Theme Dark",


    });



    $translateProvider.translations("es", {

        // INTRO Translated Labels
        "INTRO_PREVIOUS": "Atras",
        "INTRO_NEXT": "Siguiente",
        "INTRO_START": "Comenzar uPhone",
        "INTRO_LANGUAGE": "Idioma",
        "INTRO_WELCOME_HEADER": "Bienvenido a uPhone!",
        "INTRO_WELCOME_DESCRIPTION": "uContact Phone para Android",
        "INTRO_LANDING_FIRST": "Ve a la siguiente Diapositiva",
        "INTRO_LANDING_SECOND": "Para Comenzar!",
        "INTRO_NETWORK": "Por favor Ingrese La Informacion de la Red",
        "INTRO_NETWORK_HOST": "Servidor de Telefonia",
        "INTRO_NETWORK_NUMBER": "Numero de Telefono",
        "INTRO_NETWORK_PASS": "Contraseña",
        "INTRO_LAST_READY": "Esta todo Listo!",
        "INTRO_LAST_INSTRUCTION": "Toca el Boton de Abajo Para Comenzar uContact Phone",
        "INTRO_LAST_BUTTON": "Comenza uPhone !",

        // PHONE Translated Labels
        "PHONE_PLACEHOLDER_AREA": "Numero a Llamar...",
        "PHONE_STATUS_NOTREGISTERED": "No Registrado...",
        "PHONE_STATUS_REGISTERED": "Registrado...",
        "PHONE_STATUS_CONNECTING": "Conectando...",
        "PHONE_STATUS_CONNECTED": "Conectado...",
        "PHONE_STATUS_DISCONNECTED": "Desconectado...",
        "PHONE_STATUS_UNREGISTERED": "Desregistrado...",
        "PHONE_STATUS_REGISTRATIONFAILED": "Error de Registro...",
        "PHONE_STATUS_STARTING": "Comenzando...",
        "PHONE_CALLSTATUS_PEERCONNECTION": "Peerconnection...",
        "PHONE_CALLSTATUS_CONNECTING": "Conectando...",
        "PHONE_CALLSTATUS_SENDING": "Enviando...",
        "PHONE_CALLSTATUS_PROGRESS": "Sonando...",
        "PHONE_CALLSTATUS_ACCEPTING": "Aceptada...",
        "PHONE_CALLSTATUS_SENDING": "Enviando...",
        "PHONE_CALLSTATUS_CONFIRMED": "Confirmada...",
        "PHONE_CALLSTATUS_HOLD": "Hold...",
        "PHONE_CALLSTATUS_UNHOLD": "Unhold...",
        "PHONE_CALLSTATUS_MUTED": "Muteada...",
        "PHONE_CALLSTATUS_UNMUTED": "Desmuteada...",
        "PHONE_CALLSTATUS_REINVITE": "Reinvite...",
        "PHONE_CALLSTATUS_UPDATE": "Update...",
        "PHONE_CALLSTATUS_REFER": "Refer...",
        "PHONE_CALLSTATUS_REPLACES": "Replaces...",

        // Menu Translated Labels
        "MENU_PHONE": "Telefono",
        "MENU_CONTACTS": "Contactos",
        "MENU_HISTORY": "Historial",
        "MENU_CHAT": "Mensajes",
        "MENU_SETTINGS": "Configuracion",

        // Contacts Translated Labels
        "CONTACTS_TITLE": "Contactos",
        "CONTACTS_OFFLINE": "Contacts Desconectados",
        "CONTACTS_ONLINE": "Contactos En Linea",
        "CONTACTS_LOCAL": "Contactos Locales",
        "CONTACTS_NEWTITLE": "Nuevo Contacto",
        "CONTACTS_NAME": "Nombre",
        "CONTACTS_PHONENUMBER": "Numero de Telefono",
        "CONTACTS_BUTTONSAVE": "Guardar",

        // History Translated Labels
        "HISTORICAL_TITLE": "Historico",

        // Chat Translated Labels
        "CHAT_TITLE": "Mensajes",

        // ChatContact Translated Labels
        "CHATCONTACT_PLACEHOLDER": "Escriba su Mensaje...",

        // Settings Translated Labels
        "SETTINGS_TITLE": "Configuracion",
        "SETTINGS_BUTTON": "Guardar",
        "SETTINGS_CERRAR": "Cerrar",
        "SETTINGS_THEME": "Tema Dark",

    });

    $translateProvider.preferredLanguage("en");
    $translateProvider.useSanitizeValueStrategy('escapeParameters');


});