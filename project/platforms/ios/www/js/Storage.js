/*
 * Local Storage
 */
var Storage = {
        /**
         * NORMAL
         */

        /**
         * Set String
         * @param {type} key
         * @param {type} value
         */
        set: function (key, value) {
            window.localStorage[key] = value;
        },
        /**
         * Set String With Callback function
         * @param {type} key
         * @param {type} value
         * @param {type} callback
         */
        setWithCallback: function (key, value, callback) {
            window.localStorage[key] = value;

            callback();
        },

        /**
         * Get String
         * @param {type} key
         * @param {type} defaultValue
         */
        get: function (key, defaultValue) {
            return window.localStorage[key] || defaultValue;
        },

        /**
         * OBJECT
         */

        /**
         * Set Object
         * @param {type} key
         * @param {type} obj
         */
        setObject: function (key, obj) {
            window.localStorage[key] = JSON.stringify(obj);
        },
        /**
         * Get Object
         * @param {type} key
         */
        getObject: function (key, defaultValue) {
            if (window.localStorage[key]) {
                return JSON.parse(window.localStorage[key]);
            }
            else {
                return defaultValue;
            }
        }
};