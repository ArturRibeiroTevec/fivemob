'use strict';

FivemobControllers

.controller('AccountsCtrl', function(API, $state, $scope, $stateParams, $cordovaInAppBrowser, $timeout, ionicMaterialMotion, ionicMaterialInk, $ionicPopup) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    // $scope.$parent.setHeaderFab('right');

    /**
     * USERS ARRAY
     * @type {Array}
     */
    $scope.accounts = [];
    $scope.mainUser = {};

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    /**
     * BEFORE ENTER
     */
    $scope.$on('$ionicView.beforeEnter', function () {
        $scope.mainUser = API.getUser();
        $scope.accounts = [];
        $scope.$evalAsync();
        $scope.loading_accounts = true;

        $scope.showLoading('Carregando contas integradas...');

        var getAccounts = API.getAccounts();

        // success
        getAccounts.success(function (data) {
            if (data.status === '1') {
                for (var i = 0; i < data.accounts.length; i++) {
                  var account = data.accounts[i];
                  if (typeof(account.id_account) != 'undefined') {
                    account.enabled = true;
                  }
                  else {
                    account.enabled = false;
                  }

                  $scope.accounts.push(account);
                }

                $scope.hideLoading();
                $scope.loading_accounts = false;
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
        getAccounts.error(function () {
            $scope.hideLoading();
            $scope.loading_accounts = false;
            $scope.showDefaultConnectionError();
            $scope.$evalAsync();
        });
    });

    /**
     * EDIT USER
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    $scope.enable = function (index) {
      var account = $scope.accounts[index];
      var integrate_url = account.url + '?token=' + Storage.get('token', '');

      var platform = 'browser';
      if (window.cordova && window.cordova.device) {
        platform = window.cordova.device.platform;
      }

      if (platform === 'browser') {
        window.open(integrate_url, '_blank');
      }
      else {
        var options = {
          location: 'no',
          clearcache: 'yes',
          toolbar: 'yes'
        };
        $cordovaInAppBrowser.open(integrate_url, '_blank', options)
          .then(function(event) {
            // success
          })
          .catch(function(event) {
            $scope.showDefaultConnectionError();
          });
      }
    };
});
