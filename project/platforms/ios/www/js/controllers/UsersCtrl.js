'use strict';

FivemobControllers

.controller('UsersCtrl', function(API, $state, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicPopup) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    // $scope.$parent.setHeaderFab('right');

    /**
     * USERS ARRAY
     * @type {Array}
     */
    $scope.users = [];
    $scope.mainUser = {};

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    /**
     * ON CLICK: FAB-USERS
     * @param  {[type]} )     {                   $scope.openNewUserModal();    } [description]
     * @param  {[type]} false [description]
     * @return {[type]}       [description]
     */
    document.getElementById('fab-users').addEventListener('click', function () {
        $scope.addNewUser();
    }, false);

    /**
     * ADD NEW USER
     */
    $scope.addNewUser = function () {
        $state.go('app.newuser');
    };

    /**
     * BEFORE ENTER
     */
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.mainUser = API.getUser();
        $scope.users = [];
        $scope.$evalAsync();

        $scope.showLoading('Carregando usuários...');

        var getUsers = API.getUsers($scope.page);

        // success
        getUsers.success(function (data) {
            if (data.status === '1') {
                for (var i = 0; i < data.users.length; i++) {
                    $scope.users.push(data.users[i]);
                }

                $scope.hideLoading();
                $scope.loading_users = false;
                $scope.$evalAsync();

                $timeout(function() {
                    ionicMaterialMotion.fadeSlideIn({
                        selector: '.animate-fade-slide-in-right .item',
                    });
                });
            }
            else {
                $scope.hideLoading();
                $scope.showAlert('Falha', data.message);
            }
        });

        // error
        getUsers.error(function () {
            $scope.hideLoading();
            $scope.loading_users = false;
            $scope.showDefaultConnectionError();
            $scope.$evalAsync();
        });
    });

    /**
     * EDIT USER
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.editUser = function (index) {
        Storage.setObject('editUser', $scope.users[index]);
        $state.go('app.newuser');
    };
});



/**
 * NEW USER
 */
FivemobControllers

.controller('NewUserCtrl', function (API, $state, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, $cordovaActionSheet, $cordovaImagePicker, $cordovaCamera, $window, $ionicPopup) {

    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab('right');
    $scope.image_item_size = 'auto';
    $scope.image_item_inner_size = 'auto';

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    /**
     * ON CLICK: FAB-USERS
     * @param  {[type]} )     {                   $scope.openNewUserModal();    } [description]
     * @param  {[type]} false [description]
     * @return {[type]}       [description]
     */
    document.getElementById('fab-new-user').addEventListener('click', function () {
        $scope.verifyUser();
    }, false);

    /**
     * NEW USER FORM
     * @type {Object}
     */
    $scope.newUserForm = {
        name: '',
        email: '',
        password: '',
        admin: false,
        realtor: false,
    };

    $scope.required = [
        'name',
        'email',
        'password',
    ];

    // verify edit user
    var editUser = Storage.getObject('editUser', {});
    $scope.id_user = '';
    if (getObjectLength(editUser) > 0) {
        Storage.setObject('editUser', {});

        for (var i in editUser) {
            $scope.newUserForm[i] = editUser[i];
        }

        $scope.id_user = editUser.id_user;
        $scope.required = [
            'name',
            'email',
        ];
        $scope.$evalAsync();
    }
    else {
        $scope.id_user = '';
        $scope.required = [
            'name',
            'email',
            'password',
        ];
        $scope.$evalAsync();
    }

    /**
     * VERIFY USER
     * @return {[type]} [description]
     */
    $scope.verifyUser = function () {
        $scope.showLoading('Verificando dados...');

        // 1) verify required fields
        var array_empties = [];
        for (var i = 0; i < $scope.required.length; i++) {
            var field = $scope.required[i];

            // verify if field was fill
            if (typeof($scope.newUserForm[field]) == 'undefined' || $scope.newUserForm[field] === null || $scope.newUserForm[field] === '' || !$scope.newUserForm[field] || $scope.newUserForm[field] == ' ') {
                // if not, add name on array empties
                array_empties.push('field-user-' + field);
            }
        }

        if (array_empties.length > 0) {
            $scope.hideLoading();
            $scope.showAlert('Falha', 'Ops! Por favor, preencha os campos requeridos.');

            for (var i = 0; i < array_empties.length; i++) {
                var className = array_empties[i];
                console.log('CLASS NAME: ' + className);
                document.querySelector('.' + className).className += " danger-input";
            }
        }
        else {
            // OK, SAVE
            $scope.showLoading('Salvando...');
            
            var saveUser = API.saveUser($scope.newUserForm, $scope.id_user);

            /////////////
            // SUCCESS //
            /////////////
            saveUser.success(function (data) {
                if (data.status == '1') {
                    $scope.hideLoading();
                    $scope.showAlert('<b>Sucesso</b>', 'Usuário salvo com sucesso!', function () {
                        $state.go('app.users');

                        $scope.cleanForm();
                    });
                }
                else {
                    $scope.hideLoading();
                    $scope.showAlert('Falha', data.message);
                }
            });

            ///////////
            // ERROR //
            ///////////
            saveUser.error(function () {
                $scope.hideLoading();
                $scope.showDefaultConnectionError();
            });
        }
    };

    /**
     * CLEAN FORM
     * @return {[type]} [description]
     */
    $scope.cleanForm = function () {
        $scope.newUserForm = {
            name: '',
            email: '',
            password: '',
            admin: false,
            realtor: false,
        };
    };
});