/**
 * sets up services for a remote host
 */
define('services/ng-remotehost',[
    'services/ng-services',
    'services/log',
    'services/ng-settings'
],function(module,log) {
    "use strict";

    return module.service('$remotehost',[
        '$http','$settings',
        function($http,$settings) {

            //TODO: get from settings
            var host = 'http://localhost:1390/';

            return {
                readChallenge: function(version) {
                    return $settings.init().then(function(settings) {
                        var url = (settings.host||host)+'challenge/'+version;
                        return $http.get(url,{
                            transformResponse: function(d) {return d;}
                        }).then(function(response) {
                            return eval('('+response.data+')');
                        });
                    });
                },
                read: function(path) {
                    return $settings.init().then(function(settings) {
                        var url = (settings.host||host)+'fs/'+path;
                        return $http.get(url).then(function(response) {
                            return response.data;
                        });
                    });
                },
                list: function(path) {
                    return $settings.init().then(function(settings) {
                        var url = (settings.host||host)+'fs/'+path;
                        return $http.get(url,{
                            transformResponse: function(d) {return d;}
                        }).then(function(response) {
                            return response.data.split("\n");
                        });
                    });
                }
            };
        }
    ]);
});
