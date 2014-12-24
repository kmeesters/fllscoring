define('services/ng-challenge',[
    'services/log',
    'services/ng-services',
    'services/fs',
    'services/ng-settings',
    'services/ng-remotehost'
],function(log,module,fs) {
    return module.factory('$challenge',[
        '$remotehost',
        function($remotehost) {
            var mission;
            var fallBackChallenge = '2014_nl_NL-no-enum';

            function indexObjectives(missions) {
                objs = {};
                angular.forEach(missions,function(mission) {
                    angular.forEach(mission.objectives,function(obj) {
                        objs[obj.id] = obj;
                    });
                });
                return objs;
            }

            return {
                getDependencies: function(fn) {
                    var deps = fn.toString().match(/^function\s*\((.*?)\)/)[1];
                    return deps?deps.split(/\s*,\s*/):[];
                },
                load: function(challenge) {
                    var self = this;
                    //use non-angular fs to load plain javascript instead of json
                    return fs.read(challenge).then(function(defs) {
                        return self.init(eval('('+defs+')'));
                    }).catch(function() {
                        //get from remote service
                        return $remotehost.readChallenge(fallBackChallenge).then(function(challenge) {
                            return self.init(challenge);
                        });
                    }).catch(function() {
                        log('error getting field');
                    });
                },
                init: function(field) {
                    return {
                        field: field,
                        missions: field.missions,
                        objectiveIndex: indexObjectives(field.missions)
                    };
                }
            };
        }
    ]);
});
