'use strict';

FivemobControllers

.controller('LoginCtrl', function(API, $scope, $timeout, $stateParams, ionicMaterialInk, $ionicPopup, $ionicLoading, $state) {
    ionicMaterialInk.displayEffect();

    $scope.formLogin = {
        email: '',
        password: '',    
    };

    /**
     * VERIFY LOGIN
     * @return {[type]} [description]
     */
    $scope.verifyLogin = function () {
        $scope.showLoading('Verificando dados...');

        if ($scope.checkFormData()) {
            
            var doLogin = API.doLogin($scope.formLogin.email, $scope.formLogin.password);

            /////////////
            // SUCCESS //
            /////////////
            doLogin.success(function (data) {
                $scope.hideLoading();

                if (data.status == '1') {
                    // success
                    
                    // save data on storage
                    Storage.setObject('user', data.user);
                    Storage.set('token', data.token);
                    Storage.set('loggedIn', 'yes');

                    // go to properties
                    $scope.goToProperties();
                }
                else {
                    // error on webservice
                    $scope.hideLoading();
                    $scope.showAlert('Falha', data.message);
                }
            });

            ///////////
            // ERROR //
            ///////////
            doLogin.error(function () {
                $scope.hideLoading();
                $scope.showDefaultConnectionError();
            });
        }
        else {
            $scope.hideLoading();
            $scope.showAlert('Falha', 'Ops! Por favor, preencha o formulário com informações válidas.');
        }
    };

    /**
     * CHECK FORM DATA
     * @return {[type]} [description]
     */
    $scope.checkFormData = function () {
        var response = true;

        for (var e in $scope.formLogin) {
            if ($scope.formLogin[e] === '' || $scope.formLogin[e] === ' ' || $scope.formLogin[e].length == 0 || $scope.formLogin[e] == null || !$scope.formLogin[e]) {
                response = false;
                break;
            }
        }

        if (response) {
            // check email
            if ($scope.formLogin.email.indexOf('@') < 0 || $scope.formLogin.email.indexOf('.') < 0) {
                response = false;
            }
        }

        return response;
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
});