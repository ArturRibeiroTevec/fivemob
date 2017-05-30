'use strict';

FivemobControllers

.controller('AppCtrl', function(API, $state, $scope, $ionicModal, $ionicPopover, $timeout, $ionicLoading, $ionicPopup) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    ////////////////////////////////////////
    // Layout Methods
    ////////////////////////////////////////

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };

    /**
     * SHOW LOADING
     * @param  {[type]} text [description]
     * @return {[type]}      [description]
     */
    $scope.showLoading = function (text) {
        if (!text) {
            text = "Carregando";
        }

        $ionicLoading.show({
            template: '<img style="width: 15px;" src="img/loading.gif"><br>' + text
        });
    };

    /**
     * HIDE LOADING
     * @return {[type]} [description]
     */
    $scope.hideLoading = function () {
        // hide loading
        $ionicLoading.hide();
    };

    /**
     * SHOW ALERT
     * @param  {[type]}   title    [description]
     * @param  {[type]}   template [description]
     * @param  {Function} callback [description]
     * @return {[type]}            [description]
     */
    $scope.showAlert = function (title, template, callback) {
        if (!template) {
            template = 'Ocorreu um erro. Por favor, tente novamente.';
        }
        
        $ionicPopup.alert({
            title: title,
            template: '<center>' + template + '</center>',
            okType: 'button-green',
        }).then(function () {
            if (callback) {
                // execute callback
                callback();
            }
        });
    };

    /**
     * SHOW DEFAULT CONNECTION ERROR
     * @return {[type]} [description]
     */
    $scope.showDefaultConnectionError = function (callback) {
        $scope.showAlert('Conexão', 'Por favor, verifique sua conexão com a Internet e tente novamente.', callback);
    };

    /**
     * GO TO PROPERTIES
     * @return {[type]} [description]
     */
    $scope.goToProperties = function () {
        $state.go('app.properties');
    };

    /**
     * LOGOUT
     * @return {[type]} [description]
     */
    $scope.logout = function () {
        // API: do logout
        API.doLogout();

        // remove storage and go to login
        $timeout(function () {
            Storage.set('token', '');
            Storage.setObject('user', {});
            Storage.set('loggedIn', 'no');
            $state.go('login');
        });
    };
});