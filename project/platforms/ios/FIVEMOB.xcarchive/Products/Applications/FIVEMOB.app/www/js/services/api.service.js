// API SERVICE
FivemobServices.factory("API", function ($http, $state) {

    return {
        // ENV
        env: 'SANDBOX',
        // env: 'PRODUCTION',

        // DEFAULT URL
        // url: 'http://www.fivemob.com.br/webservice', // PRODUCTION
        // url: 'http://localhost:8888/fivemob/webservice', // SANDBOX
        url: 'http://alamoweb.com.br/clientes/fivemob/webservice', // DEVELOPMENT

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
         * DO REGISTER
         * @param  {[type]} name        [description]
         * @param  {[type]} email       [description]
         * @param  {[type]} password    [description]
         * @param  {[type]} admin       [description]
         * @return {[type]}                  [description]
         */
        // doRegister: function (name, sobrenome, email, password, admin) {
        doRegister: function (params) {

            // var params = {
            //     name: name,
            //     email: email,
            //     password: password,
            //     admin: admin,
            // };
            
            return $http.post(this.url + '/doRegister.php', params, {});
        },

        /**
         * GET PROPERTIES
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
         * UPDATE USER
         * @param  {[type]} params [description]
         * @return {[type]}        [description]
         */
        updateUser: function (params) {
            // get token
            var token = this.getToken();

            params.token = token;
            
            return $http.post(this.url + '/updateUser.php', params, {});
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
         *  ADD OFERECO
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
         *  REMOVE OFERECO
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