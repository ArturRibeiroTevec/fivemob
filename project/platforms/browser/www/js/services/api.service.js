// API SERVICE
FivemobServices.factory("API", function ($http, $state) {

    return {
        // ENV
        env: 'SANDBOX',
        // env: 'PRODUCTION',

        // DEFAULT URL
        url: 'http://localhost:8888/fivemob/webservice', // SANDBOX
        // url: 'http://alamoweb.com.br/clientes/fivemob/webservice', // DEVELOPMENT
        // url: 'http://squarefive.com.br/webservice', // PRODUCTION

        /**
         * GET USER
         * @return {[type]} [description]
         */
        getUser: function () {
            var user = Storage.getObject('user', {});

            return user;
        },

        /**
         * GET TOKEN
         * @return {[type]} [description]
         */
        getToken: function () {
            var token = Storage.get('token', '');

            return token;
        },

        /**
         * DO LOGIN
         * @param  {[type]} email [description]
         * @param  {[type]} password [description]
         * @return {[type]}          [description]
         */
        doLogin: function (email, password) {
            var params = {
                email: email,
                password: password,
            };

            return $http.post(this.url + '/doLogin.php', params, {});
        },

        /**
         * GET PROPERTIES
         * @param  {[type]} page [description]
         * @return {[type]}      [description]
         */
        getProperties: function (page) {
            var token = this.getToken();

            if (!page) {
                page = '1';
            }

            var params = {
                token: token,
                page: page+"",
            }

            return $http.post(this.url + '/getProperties.php', params, {});
        },

        /**
         * GET REALTORS
         * @return {[type]} [description]
         */
        getRealtors: function () {
            var token = this.getToken();

            var params = {
                token: token,
            }

            return $http.post(this.url + '/getRealtors.php', params, {});
        },

        /**
         * GET ACCOUNTS
         * @return {[type]} [description]
         */
        getAccounts: function () {
            var token = this.getToken();

            var params = {
                token: token,
            }

            return $http.post(this.url + '/getAccounts.php', params, {});
        },

        /**
         * GET USERS
         * @return {[type]} [description]
         */
        getUsers: function () {
            var token = this.getToken();

            var params = {
                token: token,
            }

            return $http.post(this.url + '/getUsers.php', params, {});
        },

        /**
         * DO LOGOUT
         * @return {[type]} [description]
         */
         doLogout: function () {
            var token = this.getToken();

            var params = {
                token: token,
            };

            // clean user
            Storage.set('user', '');
            Storage.set('token', '');

            Storage.set('loggedIn', 'no');

            return $http.post(this.url + '/doLogout.php', params, {});
        },

        /**
         * SAVE PROPERTIE
         * @param  {[type]} propertie    [description]
         * @param  {[type]} id_propertie [description]
         * @return {[type]}              [description]
         */
        savePropertie: function (propertie, id_propertie) {
            var token = this.getToken();

            var params = {
                token: token,
                propertie: propertie,
                id_propertie: (id_propertie) ? id_propertie : '',
            };

            return $http.post(this.url + '/savePropertie.php', params, {});
        },

        /**
         * UPDATE USER
         * @param  {[type]} user    [description]
         * @param  {[type]} id_user [description]
         * @return {[type]}         [description]
         */
        saveUser: function (user, id_user) {
            // get token
            var token = this.getToken();

            var params = {
                token: token,
                user: user,
                id_user: (id_user) ? id_user : '',
            };

            return $http.post(this.url + '/saveUser.php', params, {});
        },

        /**
         * REMOVE PROPERTIE
         * @param  {[type]} propertie [description]
         * @return {[type]}           [description]
         */
        removePropertie: function (propertie) {
            var token = this.getToken();

            var params = {
                token: token,
                id_propertie: propertie.id_propertie,
            };

            return $http.post(this.url + '/removePropertie.php', params, {});
        },
    };
});
