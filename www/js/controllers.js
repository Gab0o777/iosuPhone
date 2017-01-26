// Global variables
// Global Variables
var themeD = false;
var vibrate = true;
var contactList = [];
contactsLocal = [];
contactsOfline = [];
contactsOnline = [];

// Global network configuration
var host;
var number;
var pass;
var chatActive = new Object();

// AngularJS Controllers Module
angular.module('softphone.controllers', [])

// This directive makes a 'elastic' textarea (used in the agent chat)
.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("input change", resize);
                $timeout(resize, 0);
            }
        };
    }
])


// This directive calls a given function once AngularJS has finished rendered an object
.directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
})


// Intro App Controller
.controller('IntroCtrl', function($scope, $ionicModal, $timeout, $state, $ionicSlideBoxDelegate, $rootScope, $translate) {

    $scope.lang = 'en';
    $(document).ready(function() {

        // Get items from LocalStorage 
        var settings = JSON.parse(localStorage.getItem("settings"));

        // Checking if settings have been stored before from previous installation
        if (settings !== null) {
            host = settings.host;
            number = settings.callerid;
            pass = settings.password;
            themeD = settings.theme;
            // Displying settings info
            $('#Iserver').val(host);
            $('#Icallerid').val(number);
            $('#IPassword').val(pass);
        }

        $("#idioma-select").change(function() {
            var str = "";
            $("select option:selected").each(function() {
                str += $(this).val() + " ";
            });
            if (str == "English ") {
                $translate.use('en');
                $scope.lang = "en";
            } else {
                $translate.use('es');
                $scope.lang = "es";
            }
        });
    })

    // Called to navigate to the main app
    $scope.startApp = function() {

        // Checking intro to True
        var intro = {};
        var settings = {}
        intro.check = true;

        // Save network information to settings object
        settings.host = $('#Iserver').val();
        settings.callerid = $('#Icallerid').val();
        settings.password = $('#IPassword').val();
        settings.lang = $scope.lang;

        // Save network information globally
        host = settings.host;
        number = settings.callerid;
        pass = settings.password;

        // Save items to LocalStorage
        localStorage.setItem("Intro", JSON.stringify(intro));
        localStorage.setItem("settings", JSON.stringify(settings));

        $rootScope.$broadcast('UA');

        // Translate page
        $translate.use(settings.lang);

        // Go to main App
        $state.go('app.phone');
    };

    $scope.next = function() {
        $ionicSlideBoxDelegate.next();
    };

    $scope.previous = function() {
        $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
        $scope.slideIndex = index;
    };

})

// Main App Controller
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope, $ionicLoading, $state, $translate) {

    //      use this lines to break the intro    
    // intro = {};
    // settings = {};
    // settings.host= "250.ucontactcloud.com";
    // settings.callerid= "1001";
    // settings.password= "123456";
    // intro.check = false;
    // localStorage.setItem("Intro", JSON.stringify(intro));
    // localStorage.setItem("settings", JSON.stringify(settings));
    //
    // Get items from LocalStorage 
    var intro = JSON.parse(localStorage.getItem("Intro"));

    // Checking if intro has been done before
    if (intro != null) {
        if (intro.check == false) {
            $state.go('intro');
        } else {

        }
    } else {
        $state.go('intro');
    }


    $scope.data = {
        singleSelect: null,
        multipleSelect: []
    };

    // Getting Network info from Local Storage
    var settings = JSON.parse(localStorage.getItem("settings"));
    if (settings !== null) {
        host = settings.host;
        number = settings.callerid;
        pass = settings.password;
        if (settings.theme != undefined) {
            themeD = settings.theme;
        } else {
            themeD = false;
        }

        if (settings.lang == "en") {
            $scope.data.multipleSelect = 'English';
            $translate.use('en');
        } else if (settings.lang == "es") {
            $scope.data.multipleSelect = 'Espanol';
            $translate.use('es');
        } else {
            $scope.data.multipleSelect = 'English';
            $translate.use('en');
        }
    }

    $(document).ready(function() {
        
        // Checking Device Height to Check if bottom bar should be shown 
        //        if(window.innerHeight<550){
        //            $('#funcPalette').hide();  
        //        }
        //        else{
        //            $('#butHidden').hide();
        //        }            

        // Checking local Storage information
        if (settings !== null) {
            $scope.ChangeTheme(themeD);
        } else {
            $scope.ChangeTheme(false);
        }

        // Get items from LocalStorage 
        var intro = JSON.parse(localStorage.getItem("Intro"));

        // Checking if intro has been done before
        //alert(intro.check);
        if (intro != null) {
            if (intro.check == false) {
                $state.go('intro');
            } else {

            }
        } else {
            $state.go('intro');
        }
    });

    $scope.changeLang = function() {

        if ($scope.data.multipleSelect == "English") {
            $translate.use('en');
        } else {
            $translate.use('es');
        }
    }

    $scope.ChangeTheme = function(themes) {
        if (themes == undefined) {
            themes = !(themeD)
        }

        if (themes) {
            $rootScope.$broadcast('ChangingTheme', {
                theme: 'dark'
            });
            $("ion-content").addClass('dark');
            $('ion-header-bar').addClass('header');
            $("#logo").attr('src', 'images/logo.svg');
            $('.settingsTitle').addClass('dark');
            $('.item-select').addClass('dark');
            $('.input-label').addClass('dark');
            $('select').addClass('dark');
            $('.item-toggle').addClass('dark');
        } else {
            $('html').removeClass('dark');
            $rootScope.$broadcast('ChangingTheme', {
                theme: 'light'
            });
            $("ion-content").removeClass('dark');
            $('ion-header-bar').removeClass('header');
            $("#logo").attr('src', 'images/logoblack.svg');
            $('.settingsTitle').removeClass('dark');
            $('.item-select').removeClass('dark');
            $('.input-label').removeClass('dark');
            $('select').removeClass('dark');
            $('.item-toggle').removeClass('dark');
        }
        var settings = JSON.parse(localStorage.getItem("settings"));
        settings.theme = themes;
        themeD = themes;
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    $rootScope.$on('UA-Main', function(event, data) {
        $rootScope.$broadcast('UA');
    });

    $rootScope.$on('newMessage', function(event, data) { // This event is called when the main controller recives a new message
        // Checking if message source is the last acctive chat opened
        if (data.sourceID == chatActive.source) {

            // Saving historic to LocalStorage
            $scope.historic.push({
                'mensaje': data.mensaje,
                'source': data.sourceID,
                'destination': number,
                self: 'false'
            });
            localStorage.setItem(number + '-' + chatActive.source, JSON.stringify($scope.historic));
        } else {
            var historicoAgent = JSON.parse(localStorage.getItem(number + '-' + data.sourceID)); // get historic between agents
            if (historicoAgent == null) {
                historicoAgent = [];
            }

            historicoAgent.push({
                'mensaje': data.mensaje,
                'source': data.sourceID,
                'destination': number,
                self: 'false'
            });
            localStorage.setItem(number + '-' + data.sourceID, JSON.stringify(historicoAgent));

        }
        $scope.$apply(); // Have to update the view, otherwise new messages are not shown 'till refresh
    });

    // Create the settings modal that we will use later
    $ionicModal.fromTemplateUrl('settings.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Triggered in the settings modal to close it
    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the settings modal with preload network information
    $scope.settings = function() {
        // showing the settings modal
        $scope.modal.show();

        // checking theme configuration
        if (themeD) {
            $("ion-content").addClass('dark');
            $('ion-header-bar').addClass('header');
            $("#logo").attr('src', 'images/logo.svg');
            $('.settingsTitle').addClass('dark');
            $('.item-select').addClass('dark');
            $('.input-label').addClass('dark');
            $('select').addClass('dark');
            $('.item-toggle').addClass('dark');
        } else {
            $("ion-content").removeClass('dark');
            $('ion-header-bar').removeClass('header');
            $("#logo").attr('src', 'images/logoblack.svg');
            $('.settingsTitle').removeClass('dark');
            $('.item-select').removeClass('dark');
            $('.input-label').removeClass('dark');
            $('select').removeClass('dark');
            $('.item-toggle').removeClass('dark');
        }

        var settings = JSON.parse(localStorage.getItem("settings"));
        if (settings !== null) {
            // if settings exist we asign info to form
            $('#Sserver').val(host);
            $('#Scallerid').val(number);
            $('#SPassword').val(pass);
            $scope.ThemeCheck = themeD;
        }

    };

    // Save Settings Function 
    $scope.saveSettings = function() {

        // Saving Settings in LocalStorage
        var settings = {};

        // asigning values to settings object
        settings.host = $('#Sserver').val();
        settings.callerid = $('#Scallerid').val();
        settings.password = $('#SPassword').val();
        settings.theme = themeD;
        if ($scope.data.multipleSelect == "English") {
            settings.lang = "en";
        } else {
            settings.lang = "es";
        }

        // asigning values to global variables
        host = $('#Sserver').val();
        number = $('#Scallerid').val();
        pass = $('#SPassword').val();

        // Save Settings in Local Storage
        localStorage.setItem("settings", JSON.stringify(settings));
        $scope.closeLogin();

        // Calling Main Phone Controller to try connection with new settings info
        $rootScope.$broadcast('UA');
    };

})

// Contacts Controller
.controller('ContactsCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, $translate) {

    $scope.contactsLocal = [];
    $scope.contactsOnline = [];
    $scope.contactsOffline = [];
    $scope.OfflineContactsShow = false;
    $scope.OnlineContactsShow = false;
    $scope.LocalContactsShow = false;

    $scope.data = {
        showDelete: false
    };

    // Getting data from Local Storage
    var settings = JSON.parse(localStorage.getItem("settings"));

    // Checking Language conf to use in the View
    if (settings.lang == "en") {
        $translate.use('en');
    } else if (settings.lang == "es") {
        $translate.use('es');
    } else {
        $translate.use('en');
    }

    // Get Local contacts from Local Storage
    contactList = JSON.parse(localStorage.getItem('contacts'));
    if (contactList !== null) {
        for (var i = 0; i < contactList.length; i++) {
            delete contactList[i].$$hashKey;
            $scope.contactsLocal.push((contactList[i]));
        }
    }

    // On document ready we change the theme
    $(document).ready(function() {

        // Checking what theme to show
        if (themeD) {
            ChangeThemes('dark');
        } else {
            ChangeThemes('light');
        }
    });

    // Event fired when View is entered
    $scope.$on('$ionicView.enter', function() {

        // Showing 'Loading' and calling init() Method
        $ionicLoading.show();
        $scope.init();
    });

    // Event fired when Settings Theme Changes
    $scope.$on('Theming', function(ngRepeatFinishedEvent) { // removes class 'item' when new message is added so we can style it however we want
        $('.item-contacts').removeClass('item-complex');
        if (themeD) {
            $('.item-contacts').addClass('menu-items');
        } else {
            $('.item-contacts').removeClass('menu-items');
        }
    });

    // Defines the image route of an agent profile picture
    function rutaImagen(agente) {
        return "https:" + '//' + host + ':' + location.port + '/images/' + agente.replace(/ /g, '') + ".jpg";
    }

    // This function takes the Online and Offline contacts from server
    $scope.init = function() {
        $scope.contactsLocal = [];
        $scope.contactsOnline = [];
        $scope.contactsOffline = [];
        var RESTurl = "https:" + '//' + host + ':' + location.port + '/Integra/resources/';

        // If settings were never configure, we don't make the request
        if (host != null) {
            $.ajax({
                    type: "POST",
                    url: RESTurl + "auth/getcontactlist",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType: "text",
                    success: function(resp) {

                        var object = JSON.parse(resp);
                        for (var i = 0; i < object.length - 1; i++) {

                            if (typeof object[i].status != "undefined" && object[i].status.indexOf("OK") != -1 && object[i].dynamic == true) {
                                if (object[i].objectName != number) {
                                    object[i].description = rutaImagen(object[i].accountcode);
                                    $scope.contactsOnline.push(object[i]);
                                }
                            } else if (!isNaN(object[i].objectName) && object[i].dynamic == true) {
                                object[i].description = rutaImagen(object[i].accountcode);
                                $scope.contactsOffline.push(object[i]);
                            }
                        }
                    },
                    error: function(resp) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');

                        if (settings.lang == "es") {
                            $('.message-noti').html('No Se Pudo Establecer La Conexion');
                        } else {
                            $('.message-noti').html('Connection Could not Be Established');
                        }

                        $('.message-noti').stop().fadeIn(400).delay(3000).fadeOut(400);
                    }
                })
                // When request finished loading we hide the loader
                .done(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                })
        }

    }

    // Function is called when user does a 'Pull to refresh'
    $scope.doRefresh = function() {
        $scope.init();
    };

    // Function manages what group of contacts is beieng shown
    $scope.ToggleShowGroup = function(variable) {
        if (variable == 'Local') {
            $scope.LocalContactsShow = !$scope.LocalContactsShow;
        }
        if (variable == 'Offline') {
            $scope.OfflineContactsShow = !$scope.OfflineContactsShow;
        }
        if (variable == 'Online') {
            $scope.OnlineContactsShow = !$scope.OnlineContactsShow;
        }
    }

    // Check if contact group is being shown
    $scope.isGroupShown = function(variable) {
        if (variable == 'Local') {
            return $scope.LocalContactsShow;
        }
        if (variable == 'Offline') {
            return $scope.OfflineContactsShow;
        }
        if (variable == 'Online') {
            return $scope.OnlineContactsShow;
        }
    }

    // When Local contact is deleted
    $scope.onItemDelete = function(item) {
        $scope.contactsLocal.splice($scope.contactsLocal.indexOf(item), 1);
    };

    // Function that manages the change of Theme of he Contacts View
    ChangeThemes = function(theme) {
        if (theme == 'dark') {
            $("ion-content").addClass('dark');
            $('ion-header-bar').addClass('header');
            $('.newContactTitle').addClass('dark');
            $('ion-item').addClass('menu-items');
            $('ion-item').addClass('item-dark');
            $('#floating-contacts').addClass('dark');
        } else {
            $("ion-content").removeClass('dark');
            $('ion-header-bar').removeClass('header');
            $('.newContactTitle').removeClass('dark');
            $('ion-item').removeClass('menu-items');
            $('ion-item').removeClass('item-dark');
            $('#floating-contacts').removeClass('dark');
        }
    }

    // Event fired when theme is changed from the settings view
    $rootScope.$on('ChangingTheme', function(event, data) {
        ChangeThemes(data.theme);
    });

    // New ccontact Modal to add a new Local contact to the Local storage
    $ionicModal.fromTemplateUrl('newContact.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modalContact = modal;
    });

    // Triggered in the newContacct modal to close it
    $scope.closeContact = function() {
        $scope.modalContact.hide();
    };

    // Open the newContact modal
    $scope.showContact = function() {
        $scope.modalContact.show();

        // Check theme to show in the newContact modal
        if (themeD) {
            $("ion-content").addClass('dark');
            $('ion-header-bar').addClass('header');
            $('.newContactTitle').addClass('dark');
        } else {
            $("ion-content").removeClass('dark');
            $('ion-header-bar').removeClass('header');
            $('.newContactTitle').removeClass('dark');
        }
    }

    $scope.CallContact = function(number) {
        // broadcast an event to the main controller telling it to make a call to a given contact
        $rootScope.$broadcast('CallContact', {
            contact: number
        });
    }

    // This function adds a new Local Contact to the Local Storage
    $scope.addContact = function(nombre, numero) {
        if (nombre !== "" && numero !== "") {
            var contacto = new Object();
            contacto.nombre = nombre;
            contacto.numero = numero;
            $scope.contactsLocal.push(contacto);
            localStorage.setItem("contacts", JSON.stringify($scope.contactsLocal));

            // Calling Change Theme again
            if (themeD) {
                ChangeThemes('dark');
            } else {
                ChangeThemes('light');
            }
        }
    }

})

// Historic Controller
.controller('HistoryCtrl', function($scope, $rootScope, $ionicLoading, $translate) {

    // On Document Ready We change the theme of the view
    $(document).ready(function() {
        if (themeD) {
            ChangeThemes('dark');
        } else {
            ChangeThemes('light');
        }
    });

    // Getting data from Local Storage & Changing Lang depending on data stored
    var settings = JSON.parse(localStorage.getItem("settings"));
    if (settings.lang == "en") {
        $translate.use('en');
    } else if (settings.lang == "es") {
        $translate.use('es');
    } else {
        $translate.use('en');
    }

    // Fires when the View is entered
    $scope.$on('$ionicView.enter', function() {
        $ionicLoading.show({
            duration: 1000
        });
        $scope.init();
    });

    // Fires when a item has finished the render process
    $scope.$on('Theming', function(ngRepeatFinishedEvent) {

        // Gives an item the proper theme
        if (themeD) {
            $("ion-content").addClass('dark');
            $('.itemHistorical').addClass('items-historical');
            $('.itemHistorical .item-content').addClass('items-historical');
        } else {
            $("ion-content").removeClass('dark');
            $('.itemHistorical').removeClass('items-historical');
            $('.itemHistorical .item-content').removeClass('items-historical');
        }
    });

    // Listening to the Theme change 
    $rootScope.$on('ChangingTheme', function(event, data) {
        ChangeThemes(data.theme)
    });

    // Function is called when user does a 'Pull to refresh'
    $scope.doRefresh = function() {
        $scope.init();
    };

    $scope.callHistorical = function(number) {
        // We tell the main controller to execute a call to the given number
        $rootScope.$broadcast('CallContact', {
            contact: number
        });
    }

    // Called on view entered
    $scope.init = function() {

        // Checking the 'historical' local storage item
        $scope.historical = JSON.parse(localStorage.getItem("historical"));
        if ($scope.historical === null) {
            $scope.historical = [];
        } else {
            fillHistorical();
        }
        $scope.$broadcast('scroll.refreshComplete');
    }

    // Fills a object with local storage information
    function fillHistorical() {
        if ($scope.historical != []) {
            for (var i = $scope.historical.length - 1; i >= 0; i--) {
                $scope.historical[i].duration = toHHMMSS($scope.historical[i].duration);
            }
        }
    }

    // Changes the theme depending on Settings conf
    function ChangeThemes(theme) {
        if (theme == 'dark') {
            $("ion-content").addClass('dark');
            $('.itemHistorical').addClass('items-historical');
            $('.itemHistorical .item-content').addClass('items-historical');
        } else {
            $("ion-content").removeClass('dark');
            $('.itemHistorical').removeClass('items-historical');
            $('.itemHistorical .item-content').removeClass('items-historical');
        }
    }

    // Takes seconds and parses it to time format
    function toHHMMSS(sec) {
        var sec_num = parseInt(sec, 10);
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours + ':' + minutes + ':' + seconds;
    }

})

// New Contact controller
.controller('newContactCtrl', function($scope, $ionicHistory, $stateParams, $rootScope, $ionicScrollDelegate, $translate) {
    $scope.contactName = $stateParams.name; // get data from previous controller call
    $scope.image = "https:" + '//' + host + ':' + location.port + '/images/' + $scope.contactName.replace(/ /g, '') + ".jpg";

    // Event fired when item finished render process
    $scope.$on('beautify', function(ngRepeatFinishedEvent) { // removes class 'item' when new message is added so we can style it however we want
        $('.speechFrom').removeClass('item');
        $('.speechTo').removeClass('item');
    });

    var settings = JSON.parse(localStorage.getItem("settings"));
    if (settings.lang == "en") {
        $translate.use('en');
    } else if (settings.lang == "es") {
        $translate.use('es');
    } else {
        $translate.use('en');
    }

    $scope.init = function() {
        //localStorage.removeItem(number + '-' + chatActive.source);
        $scope.historic = JSON.parse(localStorage.getItem(number + '-' + chatActive.source)); // get historic between agents
        if ($scope.historic != null) {} else {
            $scope.historic = [];
        }

    }

    $scope.$on('$ionicView.enter', function() {
        vibrate = false;
    });

    $scope.$on('$ionicView.leave', function() {
        vibrate = true;
    });

    $rootScope.$on('newMessage', function(event, data) { // This event is called when the main controller recives a new message
        if (data.sourceID == chatActive.source) {
            $scope.historic.push({
                'mensaje': data.mensaje,
                'source': data.sourceID,
                'destination': number,
                self: 'false'
            });
            localStorage.setItem(number + '-' + chatActive.source, JSON.stringify($scope.historic));
        } else {
            var historicoAgent = JSON.parse(localStorage.getItem(number + '-' + data.sourceID)); // get historic between agents
            if (historicoAgent == null) {
                historicoAgent = [];
            }
            historicoAgent.push({
                'mensaje': data.mensaje,
                'source': data.sourceID,
                'destination': number,
                self: 'false'
            });
            localStorage.setItem(number + '-' + data.sourceID, JSON.stringify(historicoAgent));

        }
        $ionicScrollDelegate.scrollBottom();
        $scope.$apply(); // Have to update the view, otherwise new messages are not shown 'till refresh
    });

    $scope.goBack = function() {
        $ionicHistory.goBack();
    }

    $(document).ready(function() {
        $('.speechFrom').removeClass('item');
        $('.speechTo').removeClass('item');
        $ionicScrollDelegate.scrollBottom();
    });

    // Send message function
    $scope.send = function(message) {
        if (message) {
            // Getting message data
            var mensaje = new Object();
            mensaje.source = number;
            mensaje.sourceagent = number;
            mensaje.destination = chatActive.source;
            mensaje.message = message.trim();
            mensaje.type = "ChatMessage";

            // stopSendTyping();
            // Broadcasting a message to main controller to send message with specified data
            $rootScope.$broadcast('SendMesssage', {
                destination: chatActive.source,
                message: JSON.stringify(mensaje)
            }); // Telling the main controller to send a Message

            // Store messge in LocalStorage
            $scope.historic.push({
                'mensaje': mensaje.message.trim(),
                'source': number,
                'destination': chatActive.source,
                self: 'true'
            });
            $('#speechTa').val(' ');
            localStorage.setItem(number + '-' + chatActive.source, JSON.stringify($scope.historic));
            $ionicScrollDelegate.scrollBottom();
        }
    }
})

// Main Chat Controller
.controller('ChatCtrl', function($scope, $rootScope, $ionicModal, $ionicLoading, $ionicScrollDelegate, $translate) {
    $scope.contactosOn = [];
    $scope.contactosOff = [];
    $scope.showAddButton = true;

    if (themeD) {
        ChangeThemes('dark');
    } else {
        ChangeThemes('light');
    }

    var settings = JSON.parse(localStorage.getItem("settings"));
    if (settings.lang == "en") {

        $translate.use('en');
    } else if (settings.lang == "es") {

        $translate.use('es');
    } else {

        $translate.use('en');
    }

    $scope.init = function() {
        $ionicScrollDelegate.scrollTop();
        $scope.contactosOn = [];
        $scope.contactosOff = [];
        var RESTurl = "https:" + '//' + host + ':' + location.port + '/Integra/resources/';
        if (host != null) {
            $.ajax({
                    type: "POST",
                    url: RESTurl + "auth/getcontactlist",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    dataType: "text",
                    success: function(resp) {

                        var object = JSON.parse(resp);
                        for (var i = 0; i < object.length - 1; i++) {

                            if (typeof object[i].status != "undefined" && object[i].status.indexOf("OK") != -1 && object[i].dynamic == true) {
                                if (object[i].objectName != number) {
                                    object[i].description = rutaImagen(object[i].accountcode);
                                    $scope.contactosOn.push(object[i]);
                                }
                            } else if (!isNaN(object[i].objectName) && object[i].dynamic == true) {
                                object[i].description = rutaImagen(object[i].accountcode);
                                $scope.contactosOff.push(object[i]);
                            }
                        }

                    },
                    error: function(resp) {
                        $ionicLoading.hide();
                        $scope.$broadcast('scroll.refreshComplete');
                        $('.message-noti').html('Connection Could not Be Established');
                        $('.message-noti').stop().fadeIn(400).delay(3000).fadeOut(400);
                    }
                })
                .done(function() {
                    $scope.$broadcast('scroll.refreshComplete');
                    $ionicLoading.hide();
                });
        }

    }

    // Fired when vieww is entered
    $scope.$on('$ionicView.enter', function() {
        $ionicLoading.show();
        $scope.init();
    });

    // Event fired when object has finished render process
    $scope.$on('Theming', function(ngRepeatFinishedEvent) {
        if (themeD) {
            $('.itemChat').addClass('items-chat');
            $('.itemChat .item-content').addClass('items-chat');
        } else {
            $('.itemChat').removeClass('items-chat');
            $('.itemChat .item-content').removeClass('items-chat');
        }
    });

    $rootScope.$on('ChangingTheme', function(event, data) {
        ChangeThemes(data.theme);
    });

    $scope.openChat = function(nombre, callid) {
        chatActive.source = callid;
        chatActive.name = nombre;
    }

    $scope.verChat = function(nombre, img) {
        $rootScope.$broadcast('ContactChat', {
            nombre: nombre,
            image: img
        });
    }

    $scope.showButton = function() {
        $scope.showAddButton = true;
    }
    $scope.hideButton = function() {
        $scope.showAddButton = false;
    }

    function rutaImagen(agente) {
        return "https:" + '//' + host + ':' + location.port + '/images/' + agente.replace(/ /g, '') + ".jpg";
    }

    function ChangeThemes(theme) {
        if (theme == 'dark') {
            $("ion-content").addClass('dark');
            $('.itemChat .item-content').addClass('items-chat');
            $('.itemChat').addClass('items-chat');
        } else {
            $("ion-content").removeClass('dark');
            $('.itemChat .item-content').removeClass('items-chat');
            $('.itemChat').removeClass('items-chat');
        }
    }

})


.controller('MenuCtrl', function($scope, $rootScope) {

    ChangeTheme = function(theme) {
        if (theme == 'dark') {
            $("#logo").attr('src', 'images/logo.svg');
            $('ion-header-bar').removeClass('bar-stable');
            $('ion-header-bar').addClass('header');
            $('ion-content').addClass('menu-items');
            $('ion-list').addClass('menu-items');
            $('.list ion-item').addClass('menu-items');
            $('.item-content').addClass('menu-items');
        } else {
            $("#logo").attr('src', 'images/logoblack.svg');
            $('ion-header-bar').addClass('bar-stable');
            $('ion-header-bar').removeClass('header');
            $('ion-content').removeClass('menu-items');
            $('ion-list').removeClass('menu-items');
            $('.list ion-item').removeClass('menu-items');
            $('.item-content').removeClass('menu-items');
        }
    }

    if (themeD) {
        ChangeTheme('dark')
    } else {
        ChangeTheme('light')
    }

    $rootScope.$on('ChangingTheme', function(event, data) {
        ChangeTheme(data.theme);
    });


})

.controller('PhoneCtrl', function($scope, $rootScope, $ionicLoading, $location, $state) {
    //# sourceURL=phone.js
    $ionicLoading.show({
        duration: 2000
    });
    var timmer = 0;
    var ua = null;
    var line1 = null;
    var remoteView = document.getElementById('remoteview');
    var selfView = document.getElementById('selfview');
    var stun = "stun:stun.ucontactcloud.com";
    var voice = "{ mandatory : { googEchoCancellation: true, googEchoCancellation2: true, googAutoGainControl: true, googNoiseSuppression: true, googHighpassFilter: true, googTypingNoiseDetection: true } }";
    var video = false;
    var lastvideovalue = false;
    var videoenable = true;

    var notification = '';
    var notiCancel = false;
    var redial = '';
    var socket;
    var CDR = {};
    CDR.calleridnum = '';
    CDR.calleridname = '';
    CDR.starttime = '';
    CDR.date = null;
    CDR.inbound = '';
    CDR.duration = '';


    var closedPhone = false;

    var historical = JSON.parse(localStorage.getItem("historical"));

    if (historical === null) {
        historical = [];
    } else {
        fillHistorical();
    }

    var settings = JSON.parse(localStorage.getItem("settings"));

    if (settings !== null) {
        host = settings.host;
        number = settings.callerid;
        pass = settings.password;
        if (host !== '') {
            var socket = new JsSIP.WebSocketInterface('wss://' + host + ':8089/ws');
            startUA();
        }

    }


    function fillHistorical() {
        if (historical != []) {
            for (var i = historical.length - 1; i >= 0; i--) {
                //$scope.historical[i].duration = toHHMMSS($scope.historical[i].duration);
            }
        }
    }


    $rootScope.$on('ChangingTheme', function(event, data) {
        if (data.theme == 'dark') {
            $("#funcPalette").addClass('funcPalette');
            $('.butHidden').addClass('dark');
            $("ion-content").addClass('dark');
            $('.botonera').addClass('funcButon');
            $("#logo").attr('src', 'images/logo.svg');
        } else {
            $("#funcPalette").removeClass('funcPalette');
            $('.butHidden').removeClass('dark');
            $("ion-content").removeClass('dark');
            $('.botonera').removeClass('funcButon');
            $("#logo").attr('src', 'images/logoblack.svg');
        }
    });

    $('#butHidden').click(function() {
        $('#funcPalette').slideToggle();
        setInterval(function() {
            $('#funcPalette').slideUp();
        }, 10000);
    });

    $("#btn_video").click(function() {
        if (videoenable) {
            if (line1 === null) {
                video = !video;
                lastvideovalue = video;
                changevideobutton();
                if (video) {
                    $('.message-noti').html('Video Call Activated');
                } else {
                    $('.message-noti').html('Video Call Deactivated');
                }
                $('.message-noti').stop().fadeIn(400).delay(3000).fadeOut(400);
            }
        }
    });

    $("#btn_conf").click(function() {
        $("#btn_conf").toggleClass('activePhoneIcon');
        if ($('#btn_conf').hasClass('activePhoneIcon')) {
            if (settings.lang == "en") {
                $('#output').attr("placeholder", 'Conference...');
            } else {
                $('#output').attr("placeholder", 'Conferencia...');
            }
        } else {
            if (settings.lang == "en") {
                $('#output').attr("placeholder", 'Type to Call...');
            } else {
                $('#output').attr("placeholder", 'Numero a Llamar...');
            }

        }
    });


    $("#inputconf").keypress(function(e) {
        if (e.which == 13) {
            var val = $(this).val();
            conferencia("555" + val);
            $("#btn_conf_content").hide();
            $("#inputconf").val("");
        }
    });


    $('#reject_call').bind('click', hangUp);
    $('#reject_callVideo').bind('click', hangUpVideo);

    $('#videoCallActive').bind('click', videoCallActive)

    $('#openKeyboard').bind('click', openKeyboard)

    $("#hangupfullscreen").bind('click', function() {
        $("#videoContainer").fullScreen(false);
        hangUp();
    });
    $('#place_call').bind('click', callHandler);

    $('#answerButton').click(function() {
        answer();
    });
    $('#hangUpButton').click(function() {
        hangUp();
    });

    $('#btn_atransfer').click(function() {
        attendedTransfer("");
    });
    $('#btn_btransfer').click(function() {
        blindTransfer("");
    });

    var isInMute = false;
    $('#btn_mute').click(function() {
        if (line1 !== null) {
            toggleMute(isInMute);
        }
    });

    $("#btnmutefullscreen").click(function() {
        if (line1 !== null) {
            toggleMute(isInMute);
        }
    });


    var isInHold = false;
    $('#btn_hold').click(function() {
        if (line1 !== null) {
            toggleHold(isInHold);
        }
    });

    $(".focusCall").click(function() {
        $("#output").focus();
    });

    $('.digits').bind('touchstart', function(e) {
        digit = e.currentTarget.childNodes[0].data;
        SendDTMF(digit);
        $('#output').val($('#output').val() + digit);
    });

    $('.digits').mouseup(function(e) {
        StopDTMF();
    });

    $('#output').keypress(function(e) {

        switch (e.which) {
            case 13:
                var hasEnter = $("#output").val();
                hasEnter = hasEnter.replace(/(\r\n|\n|\r)/gm, "");

                hasEnter = hasEnter.replace(/ /g, '').trim();
                hasEnter = hasEnter.replace(/\s+/g, "");
                $("#output").val(hasEnter);
                callHandler();
                break;
        }

        switch (String.fromCharCode(e.which)) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '*':
            case '#':
            case '+':
                SendDTMF(String.fromCharCode(e.which));
                break;
            default:
                return false;
        }


    });




    function changevideobutton() {
        if (video) {
            $(".colvideo").addClass('activePhoneIcon');
        } else {
            $(".colvideo").removeClass('activePhoneIcon');
        }
    }

    function conferencia(num) {
        if (line1 !== null) {
            blindTransfer(num);
        } else {
            makeCall(num);
        }
    }

    $rootScope.$on('UA', function(event, data) {
        if (ua !== null) {
            ua.stop();
        }
        if (host !== '') {
            socket = new JsSIP.WebSocketInterface('wss://' + host + ':8089/ws');
            startUA();
        }
    });

    $rootScope.$on('CallContact', function(event, data) {
        makeCall(data.contact);
        $('#output').html(data.contact);
    });

    function startUA() {
        var configuration = {
            'sockets': [socket],
            'uri': 'sip:' + number + '@' + host,
            'password': pass,
            'session_timers': false,
            'realm': 'asterisk'
        };

        var defineUrl = "https:" + '//' + host + '/Integra/resources/';
        ua = new JsSIP.UA(configuration);
        ua.start();
        attachUAEventHandlers();

    }

    function attachUAEventHandlers() {

        ua.on('registered', function(data) {
            $('#phonestatus').html('Registered...');
        });
        ua.on('connecting', function(data) {
            $('#phonestatus').html('Connecting...');
        });
        ua.on('connected', function(data) {
            $('#phonestatus').html('Connected...');
        });
        ua.on('disconnected', function(data) {
            console.log('Disconnected...'); //dont show
        });
        ua.on('unregistered', function(data) {
            $('#phonestatus').html('Unregistered...');
        });
        ua.on('registrationFailed', function(data) {
            $('#phonestatus').html('Registration Failed...');
        });
        ua.on('newRTCSession', function(data) {

            if (line1 === null) {
                CDR.starttime = new Date();
                var interval = -1;
                if (data.originator == 'remote') {

                    line1 = data.session;
                    lastvideovalue = video;
                    //check for video
                    var indx = line1.request.body.indexOf('m=video');
                    if (indx > 0) {
                        video = true;
                    } else {
                        video = false;
                    }
                    changevideobutton();

                    CDR.calleridnum = data.session.remote_identity.uri.user;
                    CDR.calleridname = data.request.from.display_name;
                    CDR.inbound = true;

                    $('#phonestatus').html('Starting...');
                    $('#inoutcall').html('<i class="fa fa-arrow-down"></i>');
                    //('#callerinfo').html(CDR.calleridname);
                    $('#output').val(CDR.calleridnum);
                    StartRing();
                    if (video != false) {
                        interval = Vibrating();
                        if (settings.lang == 'es') {
                            notifWVibration('Videollamada de ' + CDR.calleridname, CDR.calleridnum, interval);
                        } else {
                            notifWVibration('Videocall from ' + CDR.calleridname, CDR.calleridnum, interval);
                        }

                    } else {
                        interval = Vibrating();
                        if (settings.lang == 'es') {
                            notifWVibration('Llamada de ' + CDR.calleridname, CDR.calleridnum, interval);
                        } else {
                            notifWVibration('Call From ' + CDR.calleridname, CDR.calleridnum, interval);
                        }

                    }

                    var aa = data.request.getHeader('P-Auto-Answer');
                    if (typeof aa != 'undefined' && aa.indexOf('normal') != -1) {
                        answer();
                        window.clearInterval(interval);
                    }
                } else {
                    CDR.inbound = false;
                    line1 = data.session;
                    $('#phonestatus').html('Starting...');
                    $('#inoutcall').html('<i class="fa fa-arrow-up"></i>');

                }
                attachCallEventHandlers(interval);

            } else {
                data.session.terminate();
            }

        });

        ua.on('newMessage', function(data) {

            if (data.originator == "remote") {

                var remote = parseRemoteString(data.message.remote_identity.toString());
                var mensaje = JSON.parse(data.message.content);

                if (typeof mensaje.status != "undefined" && mensaje.status == "OFFLINE") {
                    //activeUser(false);
                    return false;
                } else if (mensaje.type == "ChatMessageTyping") {
                    if (mensaje.message == "typing") {
                        // handleTyping(true, mensaje.source);
                    } else {
                        // handleTyping(false, mensaje.source);
                    }
                    //activeUser(true);
                } else {
                    // activeUser(true);

                    // Vibrating twice for new Message
                    if (vibrate) {
                        navigator.notification.vibrate(500);
                        setTimeout(function() {
                            navigator.notification.vibrate(500);
                        }, 600);
                    }

                    // Visual Notification in Main Screen
                    if (settings.lang == "es") {
                        $('.message-noti').html('Nuevo Mensaje de ' + mensaje.sourceagent);
                    } else {
                        $('.message-noti').html('New Message from ' + mensaje.sourceagent);
                    }

                    $('.message-noti').stop().fadeIn(400).delay(3000).fadeOut(400);


                    var dts = Math.floor(Date.now());
                    var options = {
                        dir: 'auto',
                        body: '',
                        noscreen: false,
                        sticky: true,
                        timestamp: dts
                    };

                    if ((notification == '')) {
                        if (settings.lang == "es") {
                            notification = new Notification('Nuevo Mensaje de ' + mensaje.sourceagent, options);
                        } else {
                            notification = new Notification('New Message from ' + mensaje.sourceagent, options);
                        }
                    }

                    if (typeof click == "undefined") {
                        notification.onclick = function() {
                            $state.go('app.chat');
                            notiCancel = true;
                            notification.close();
                        };

                        notification.onclose = function() {
                            notiCancel = false;
                            notification = '';
                        };
                    } else {
                        notification.onclick = function() {

                            notiCancel = true;
                            notification.close();
                        };

                        notification.onclose = function() {
                            notiCancel = false;
                            notification = '';

                        };
                    }
                    $rootScope.$broadcast('newMessage', {
                        'mensaje': mensaje.message,
                        'sourceID': mensaje.source,
                        'agent': mensaje.sourceagent
                    });
                    // recibeChat(mensaje, remote);
                }
            }
        });
    }

    function parseRemoteString(remote) {
        var start = remote.indexOf("<");
        var end = remote.indexOf(">");

        var adress = remote.substring(start + 1, end);
        start = adress.indexOf(":");
        end = adress.indexOf("@");

        var number = adress.substring(start + 1, end);
        return number;
    }

    function attachCallEventHandlers(interval) {

        line1.on('peerconnection', function(data) {
            $('#phonestatus').html('Peerconnection...');
        });

        line1.on('connecting', function(data) {
            $('#phonestatus').html('Connecting...');
            attachRTCHandlers();
        });

        line1.on('sending', function(data) {
            $('#phonestatus').html('Sending...');
        });

        line1.on('progress', function(data) {

            $('#phonestatus').html('Ringing...');
            StartRing();
        });

        line1.on('accepted', function(data) {
            $('#phonestatus').html('Accepted...');
            if (interval != -1) {
                window.clearInterval(interval);
            }
        });

        line1.on('confirmed', function(data) {
            selfView.src = window.URL.createObjectURL(line1.connection.getLocalStreams()[0]);
            if (interval != -1) {
                window.clearInterval(interval);
            }
            $('#phonestatus').html('Confirmed...');
        });

        line1.on('ended', function(data) {

            finishcall('Ended - ' + data.cause);
        });

        line1.on('failed', function(data) {

            finishcall('Failed - ' + data.cause);
            if (!ua.isRegistered()) {
                ua.stop();
                startUA();
            }

        });

        line1.on('newDTMF', function(data) {
            console.log('NewDTMF...');
        });

        line1.on('hold', function(data) {
            $('#phonestatus').html('Hold...');
        });

        line1.on('unhold', function(data) {
            $('#phonestatus').html('Unhold...');
        });

        line1.on('muted', function(data) {
            $('#phonestatus').html('Muted...');
        });

        line1.on('unmuted', function(data) {
            $('#phonestatus').html('Unmuted...');
        });

        line1.on('reinvite', function(data) {
            console.log('Reinvite...');
        });

        line1.on('update', function(data) {
            console.log('Update...');
        });

        line1.on('refer', function(data) {
            console.log('Refer...');
        });

        line1.on('replaces', function(data) {
            console.log('Replaces...');
        });


    }

    function attachRTCHandlers() {

        line1.connection.onaddstream = function(data) {
            remoteView.srcObject = data.stream;
            //console.log('Add Stream...');
        };

        line1.connection.onremovestream = function(data) {
            //console.log('Removestream...');
        };

        line1.connection.oniceconnectionstatechange = function(data) {
            if (data.srcElement.iceConnectionState == 'connected') {
                startCall();
            }
            //console.log('ICE Changed...');
        };

    }

    $rootScope.$on('SendMesssage', function(event, data) {
        SendMessage(data.destination, data.message);
    });

    function SendMessage(destination, message) {
        ua.sendMessage('sip:' + destination + '@' + host, message);
    }

    function makeCall(destination) {

        if (line1 === null) {

            if ($('#btn_conf').hasClass('activePhoneIcon')) {
                destination = "555" + destination;
            }

            var options = {
                'mediaConstraints': {
                    'audio': voice,
                    'video': video
                },
                'pcConfig': {
                    'iceServers': [{
                        'urls': [stun]
                    }],
                    'rtcpMuxPolicy': "negotiate",
                }
            };

            CDR.calleridnum = destination;
            CDR.calleridname = '';
            redial = destination;
            ua.call('sip:' + destination + '@' + host, options);

        } else {
            if ($('#btn_conf').hasClass('activePhoneIcon')) {
                blindTransfer("555" + destinaton);
            }
        }

    }

    function answer() {

        notiCancel = true;
        if (line1 !== null && line1.direction != 'outgoing') {
            var options = {
                'mediaConstraints': {
                    'audio': voice,
                    'video': video
                },
                'pcConfig': {
                    'iceServers': [{
                        'urls': [stun]
                    }],
                    'rtcpMuxPolicy': "negotiate",
                }
            };
            line1.answer(options);
        }
    }

    function openKeyboard() {
        $("#videoContainer").slideUp();
        $("#videoContainer").removeClass('VideoBackground');
        $("#phone-container").slideDown();
    }

    function hangUpVideo() {
        $("#videoContainer").slideUp();
        $("#videoContainer").removeClass('VideoBackground');
        $("#phone-container").slideDown();
        $('#videoCallActive').hide();
        hangUp();
    }

    function videoCallActive() {
        $("#videoContainer").slideDown();
        $("#videoContainer").addClass('VideoBackground');
        $("#phone-container").slideUp();
    }

    function hangUp() {

        if (line1 === null) {
            $('#output').val('');
            if (ua.isRegistered())
                $('#phonestatus').html('Registered...');
            else
                $('#phonestatus').html('Not Registered...');
        }
        $("#callerinfo").html("");
        $('#videoCallActive').hide();
        ua.terminateSessions();
        line1 = null;

    }

    function SendDTMF(dtmfval) {

        PlayDTMF(dtmfval);

        if (line1 !== null) {
            if (line1.status != 2) {
                line1.sendDTMF(dtmfval);
            }

        }

    }

    function blindTransfer(destination) {

        if (line1 !== null) {
            if (destination === "") {
                line1.sendDTMF('##');
            } else {
                line1.sendDTMF('##' + destination);
            }
        }
    }

    function attendedTransfer(destination) {

        if (line1 !== null) {
            if (destination === "") {
                line1.sendDTMF('#0');
            } else {
                line1.sendDTMF('#0' + destination);
            }
        }

    }

    function hold() {

        if (line1 !== null) {
            line1.hold();
        }
    }

    function unhold() {

        if (line1 !== null) {
            line1.unhold();
        }
    }

    function mute() {

        if (line1 !== null) {
            line1.mute();
        }
    }

    function unmute() {

        if (line1 !== null) {
            line1.unmute();
        }
    }

    function emptyVideo() {
        remoteView.src = "";
        selfView.src = "";
    }

    function Vibrating() {
        navigator.notification.vibrate(1500);
        var interval = setInterval(function() {
            navigator.notification.vibrate(1000)
        }, 3000);
        return interval
    }

    function notifWVibration(title, body, interval) {

        if (Notification.permission === "granted") {
            createNotificationVibration(title, body, interval);
        } else {
            Notification.requestPermission(function(permission) {
                createNotificationVibration(title, body, interval);
            });
        }
    }

    function notifOutOfTheBrowser(title, body) {

        if (Notification.permission === "granted") {
            createNotification(title, body);
        } else {
            Notification.requestPermission(function(permission) {
                createNotification(title, body);
            });
        }
    }

    function createNotificationVibration(title, body, interval, click) {

        var options = {
            dir: 'ltr',
            body: body
        };

        notification = new Notification(title, options);

        if (typeof click == "undefined") {
            notification.onclick = function() {
                answer();
                notiCancel = true;
                notification.close();
                window.clearInterval(interval);
            };

            notification.onclose = function() {
                if (!notiCancel) {
                    hangUp();
                }
                notiCancel = false;
                notification = '';
                window.clearInterval(interval);
            };
        } else {
            notification.onclick = function() {
                goToChatList();
                notiCancel = true;
                notification.close();
                window.clearInterval(interval);
            };

            notification.onclose = function() {
                notiCancel = false;
                notification = '';
                window.clearInterval(interval);
            };
        }

    }


    function createNotification(title, body, click) {

        var options = {
            dir: 'ltr',
            body: body
        };

        notification = new Notification(title, options);

        if (typeof click == "undefined") {
            notification.onclick = function() {
                answer();
                notiCancel = true;
                notification.close();
            };

            notification.onclose = function() {
                if (!notiCancel) {
                    hangUp();
                }
                notiCancel = false;
                notification = '';
            };
        } else {
            notification.onclick = function() {
                goToChatList();
                notiCancel = true;
                notification.close();
            };

            notification.onclose = function() {
                notiCancel = false;
                notification = '';

            };
        }

    }

    function finishcall(status) {

        video = lastvideovalue;
        changevideobutton();

        emptyVideo();
        StopRing();
        toggleHold(true);
        toggleMute(true);
        if (notification !== '')
            notification.close();
        $('#inoutcall').empty();
        $('#phonestatus').html(status);
        line1 = null;

        PlayHangup();
        if (CDR.date !== null)
            CDR.duration = Math.round(((new Date()) - CDR.date) / 1000);
        else
            CDR.duration = 0;

        historical.push(clone(CDR));
        if (historical.length > 100) {
            historical.shift();
        }
        localStorage.setItem("historical", JSON.stringify(historical));
        CDR.date = null;

        $('#videoCallActive').hide();
        $("#phone-container").slideDown();
        $("#timeinfo").html("");
    }

    function startCall() {

        StopRing();

        if (notification !== '')
            notification.close();
        $('#phonestatus').html('Speaking...');
        CDR.date = new Date();
        if (video) {
            $("#videoContainer").slideDown();
            $("#videoContainer").addClass('VideoBackground');
            $("#phone-container").slideUp();
            $('#videoCallActive').show();
        }

        //cronoPrincipal.start();

    }

    function callHandler() {

        if (line1 === null) {

            if ($('#output').val() === '') {
                $('#output').val(redial);
                return;
            }
            var num = $('#output').val().replace(/ /g, '');
            makeCall(num);

        } else {

            answer();
        }

    }


    function toggleMute(muted) {

        if (!muted) {
            mute();
            $(".colmute").addClass('activePhoneIcon');
            isInMute = true;

        } else {
            unmute();
            $(".colmute").removeClass('activePhoneIcon');
            isInMute = false;
        }
    }

    function toggleHold(holded) {
        if (!holded) {
            hold();
            $(".colhold").addClass('activePhoneIcon');
            isInHold = true;

        } else {
            unhold();
            $(".colhold").removeClass('activePhoneIcon');
            isInHold = false;
        }
    }

    function __isInCall() {
        return line1 !== null;
    }

    function __unregister() {
        if (ua !== null) ua.stop();
    }

    function __register() {
        __unregister();
        startUA();
    }

    function __hangUp() {
        if (ua !== null) ua.terminateSessions();
    }


    //Sounds
    var context = new AudioContext();
    var ringbackTone = new Tone(context, 440, 480);
    var dtmf = new Tone(context, 350, 440);
    var dtmfFrequencies = {
        "1": {
            f1: 697,
            f2: 1209
        },
        "2": {
            f1: 697,
            f2: 1336
        },
        "3": {
            f1: 697,
            f2: 1477
        },
        "4": {
            f1: 770,
            f2: 1209
        },
        "5": {
            f1: 770,
            f2: 1336
        },
        "6": {
            f1: 770,
            f2: 1477
        },
        "7": {
            f1: 852,
            f2: 1209
        },
        "8": {
            f1: 852,
            f2: 1336
        },
        "9": {
            f1: 852,
            f2: 1477
        },
        "*": {
            f1: 941,
            f2: 1209
        },
        "0": {
            f1: 941,
            f2: 1336
        },
        "#": {
            f1: 941,
            f2: 1477
        },
        "+": {
            f1: 941,
            f2: 1477
        }
    };

    Tone.prototype.setup = function() {
        this.osc1 = context.createOscillator();
        this.osc2 = context.createOscillator();
        this.osc1.frequency.value = this.freq1;
        this.osc2.frequency.value = this.freq2;

        this.gainNode = this.context.createGain();
        this.gainNode.gain.value = 0.25;

        this.filter = this.context.createBiquadFilter();
        this.filter.type = "lowpass";
        this.filter.frequency = 8000;

        this.osc1.connect(this.gainNode);
        this.osc2.connect(this.gainNode);

        this.gainNode.connect(this.filter);
        this.filter.connect(context.destination);
    };

    Tone.prototype.start = function() {
        this.setup();
        this.osc1.start(0);
        this.osc2.start(0);
        this.status = 1;
    };

    Tone.prototype.stop = function() {
        this.osc1.stop(0);
        this.osc2.stop(0);
        this.status = 0;
    };

    Tone.prototype.createRingerLFO = function() {
        // Create an empty 3 second mono buffer at the
        // sample rate of the AudioContext
        var channels = 1;
        var sampleRate = this.context.sampleRate;
        var frameCount = sampleRate * 6;
        var arrayBuffer = this.context.createBuffer(channels, frameCount, sampleRate);

        // getChannelData allows us to access and edit the buffer data and change.
        var bufferData = arrayBuffer.getChannelData(0);
        for (var i = 0; i < frameCount; i++) {
            // if the sample lies between 0 and 0.4 seconds, or 0.6 and 1 second, we want it to be on.
            //if ((i/sampleRate > 0 && i/sampleRate < 0.4) || (i/sampleRate > 0.6 && i/sampleRate < 1.0)){
            if ((i / sampleRate > 0 && i / sampleRate < 2)) {
                bufferData[i] = 0.25;
            }
        }

        this.ringerLFOBuffer = arrayBuffer;
    };

    Tone.prototype.startRinging = function() {
        this.start();
        // set our gain node to 0, because the LFO is calibrated to this level
        this.gainNode.gain.value = 0;
        this.status = 1;
        this.createRingerLFO();
        this.ringerLFOSource = this.context.createBufferSource();
        this.ringerLFOSource.buffer = this.ringerLFOBuffer;
        this.ringerLFOSource.loop = true;
        // connect the ringerLFOSource to the gain Node audio param
        this.ringerLFOSource.connect(this.gainNode.gain);
        this.ringerLFOSource.start(0);
    };

    Tone.prototype.stopRinging = function() {
        this.stop();
        this.ringerLFOSource.stop(0);
    };

    function Tone(context, freq1, freq2) {
        this.context = context;
        this.status = 0;
        this.freq1 = freq1;
        this.freq2 = freq2;
    }

    function StartRing() {
        if (ringbackTone.status === 0)
            ringbackTone.startRinging();
    }

    function StopRing() {
        if (ringbackTone.status == 1)
            ringbackTone.stopRinging();
    }

    function PlayHangup() {
        var osc = context.createOscillator();
        var amp = context.createGain();
        osc.connect(amp);
        amp.connect(context.destination);
        amp.gain.value = 0.2;

        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.1);

        osc = context.createOscillator();
        amp = context.createGain();

        osc.connect(amp);
        amp.connect(context.destination);
        amp.gain.value = 0.2;

        osc.start(context.currentTime + 0.5);
        osc.stop(context.currentTime + 0.6);


    }

    function PlayAnswer() {
        var osc = context.createOscillator();
        var amp = context.createGain();

        osc.connect(amp);
        amp.connect(context.destination);
        amp.gain.value = 0.2;

        osc.start(context.currentTime);
        osc.stop(context.currentTime + 0.3);

    }

    function PlayDTMF(keyPressed) {

        var frequencyPair = dtmfFrequencies[keyPressed];

        dtmf.freq1 = frequencyPair.f1;
        dtmf.freq2 = frequencyPair.f2;

        if (dtmf.status === 0) {
            dtmf.start();
        }

    }

    function StopDTMF() {

        if (typeof dtmf !== "undefined" && dtmf.status) {
            dtmf.stop();
        }
    }

    function clone(obj) {
        if (null === obj || "object" !== typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }

    window.onbeforeunload = function(e) {

        ua.terminateSessions();
        __unregister();
    }

    function isNumberKey(evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        var keycode = String.fromCharCode(evt.keyCode);

        if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
            if (keycode == '#' || keycode == "*" || keycode == '+') {
                return true

            } else {
                return false;
            }

        }

        return true;
    }


})