// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('Fivemob', ['ionic', 'Fivemob.controllers', 'Fivemob.services', 'ionic-material', 'ionMdInput', 'ngCordova', 'ui.utils.masks'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            cordova.plugins.Keyboard.disableScroll(false);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });
})

/**
* Serialize to HTTP Provider
* @param {type} $httpProvider
*/
.config(function ($httpProvider) {
    $httpProvider.defaults.transformRequest = function (data) {
        if (data === undefined) {
            return data;
        }
        return serialize(data);
    };
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
})

/**
* Angular ng-enter on inputs
*/
.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

/**
* Filter to ng-repeat to order objects
*/
.filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        if (typeof (items) === 'object') {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse)
            filtered.reverse();
            return filtered;
        }
        else if (typeof (items) === 'array') {
            items.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse)
            items.reverse();
            return items;
        }
    };
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.properties', {
        url: '/properties',
        views: {
            'menuContent': {
                templateUrl: 'templates/properties.html',
                controller: 'PropertiesCtrl'
            },
            'fabContent': {
                template: '<button id="fab-properties" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-properties').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.newpropertie', {
        url: '/new-propertie',
        views: {
            'menuContent': {
                templateUrl: 'templates/new.propertie.html',
                controller: 'NewPropertieCtrl'
            },
            'fabContent': {
                template: '<button id="fab-new-propertie" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-checkmark"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-new-propertie').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.users', {
        url: '/users',
        views: {
            'menuContent': {
                templateUrl: 'templates/users.html',
                controller: 'UsersCtrl'
            },
            'fabContent': {
                template: '<button id="fab-users" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-plus"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-users').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.newuser', {
        url: '/new-user',
        views: {
            'menuContent': {
                templateUrl: 'templates/new.user.html',
                controller: 'NewUserCtrl'
            },
            'fabContent': {
                template: '<button id="fab-new-user" class="button button-fab button-fab-bottom-right button-energized-900"><i class="icon ion-checkmark"></i></button>',
                controller: function ($timeout) {
                    $timeout(function () {
                        document.getElementById('fab-new-user').classList.toggle('on');
                    }, 200);
                }
            }
        }
    })

    .state('app.accounts', {
        url: '/accounts',
        views: {
            'menuContent': {
                templateUrl: 'templates/accounts.html',
                controller: 'AccountsCtrl'
            },
        }
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })
    ;

    // if none of the above states are matched, use this as the fallback
    // $urlRouterProvider.otherwise('/app/login');

    // verifica se o user já está logado
    var token = Storage.get('token', '');

    if (token !== '' && token !== null && token) {
        // go home
        $urlRouterProvider.otherwise('/app/properties');
    }
    else {
        // go to login
        $urlRouterProvider.otherwise('/login');
    }
});

/**
* INIT APP
*/
var FivemobControllers = angular.module('Fivemob.controllers', []);
var FivemobServices = angular.module('Fivemob.services', []);
