describe('ng-challenge',function() {
    var ngServices = factory('services/ng-services');
    var challenge, q;

    var dummyChallenge = {foo:'bar'};

    var fsMock, settingsMock, remotehostMock,$q;
    fsMock = createFsMock({'foo': JSON.stringify(dummyChallenge)});

    var module = factory('services/ng-challenge',{
        'services/ng-services': ngServices,
        'services/fs': fsMock
    });


    beforeEach(function() {
        settingsMock = createSettingsMock({});
        remotehostMock = createRemotehostMock(Q);

        angular.mock.module(function($provide) {
            $provide.value('$settings', settingsMock);
            $provide.value('$remotehost', remotehostMock);
        });
        angular.mock.module(module.name);
        angular.mock.inject(function($challenge,_$q_) {
            challenge = $challenge;
            $q = _$q_;
        });
    });

    describe('getDependencies',function() {
        it('should resolve the arguments of a function',function() {
            var deps = challenge.getDependencies(function(foo,bar,baz) {});
            expect(deps).toEqual(['foo','bar','baz']);
        });

        it('should resolve the arguments of a function with no arguments',function() {
            var deps = challenge.getDependencies(function() {});
            expect(deps).toEqual([]);
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

        it('when failing, it should load from remote, then init',function(done) {
            fsMock.read.andReturn(Q.reject());
            remotehostMock.readChallenge.andReturn(Q.when(dummyChallenge));
            challenge.init = jasmine.createSpy('init').andReturn(42);
            challenge.load('bar').then(function() {
                expect(remotehostMock.readChallenge).toHaveBeenCalled();
                expect(challenge.init).toHaveBeenCalledWith(dummyChallenge);
                done();
            },done);

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
