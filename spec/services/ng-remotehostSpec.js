describe('ng-remotehost',function() {
    var ngServices = factory('services/ng-services');
    var module = factory('services/ng-remotehost',{
        'services/ng-services': ngServices,
        'services/log': logMock
    });

    var $remotehost, $httpBackend, $q, settingsMock;

    beforeEach(function() {
        angular.mock.module(module.name);
        angular.mock.module(function($provide) {
            $provide.service('$settings',function($q) {
                return createSettingsMock($q, {});
            });
        });
        angular.mock.inject(function(_$remotehost_, _$q_, _$httpBackend_) {
            $remotehost = _$remotehost_;
            $httpBackend = _$httpBackend_;
            $q = _$q_;
        });
    });



    describe('readChallenge',function() {
        it('should get the challenge',function() {
            $httpBackend.expectGET('http://localhost:1390/challenge/foo').respond('"bar"');
            $remotehost.readChallenge('foo').then(function(res) {
                expect(res).toBe('bar');
            });
            $httpBackend.flush();
        });
    });

    describe('read',function() {
        it('should read from the filesystem of the remote host',function() {
            $httpBackend.expectGET('http://localhost:1390/fs/foo').respond('[1,2,3]');
            $remotehost.read('foo').then(function(res) {
                expect(res).toEqual([1,2,3]);
            });
            $httpBackend.flush();
        });
    });

    describe('write',function() {
        it('should write to the filesystem of the remote host',function() {
            $httpBackend.expectPOST('http://localhost:1390/fs/foo',[1,2,3]).respond(201);
            $remotehost.write('foo',[1,2,3]);
            $httpBackend.flush();
        });
    });

});
