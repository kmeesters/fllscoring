describe('ng-challenge',function() {
    var ngServices = factory('services/ng-services');
    var challenge, q;

    var dummyChallenge = {foo:'bar'};

    var module = factory('services/ng-challenge',{
        'services/ng-services': ngServices,
        'services/fs': createFsMock({'foo': JSON.stringify(dummyChallenge)})
    });

    var settingsMock;

    beforeEach(function() {
        settingsMock = createSettingsMock({});
        angular.mock.module(function($provide) {
            $provide.value('$settings', settingsMock);
        });
        angular.mock.module(module.name);
        angular.mock.inject(function($challenge,$q) {
            challenge = $challenge;
        });
    });

    describe('getDependencies',function() {
        it('should resolve the arguments of a function',function() {
            var deps = challenge.getDependencies(function(foo,bar,baz) {});
            expect(deps).toEqual(['foo','bar','baz']);
        });
    });

    describe('load',function() {
        it('should load, then init',function(done) {
            challenge.init = jasmine.createSpy('init').andReturn(42);
            challenge.load('foo').then(function() {
                expect(challenge.init).toHaveBeenCalledWith(dummyChallenge);
                done();
            });
        });
    });

    describe('init',function() {
        it('should prepare the challenge',function() {
            var field = {
                missions: [{
                    id: 'test',
                    objectives: [{
                        id: 'moo',
                    }]
                }]
            };
            var res = challenge.init(field);

            expect(res.field).toEqual(field);
            expect(res.missions).toEqual([{objectives:[{id:'moo'}],id:'test'}]);
            expect(res.objectiveIndex).toEqual({moo: {id:'moo'}});
        });
    });
});
