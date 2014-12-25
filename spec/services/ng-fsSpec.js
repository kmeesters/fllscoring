describe('ng-fs',function() {
    var ngServices = factory('services/ng-services');
    var fsMock = createFsMock({'foo': '"dummydata"'});
    var module = factory('services/ng-fs',{
        'services/ng-services': ngServices,
        'services/fs': fsMock
    });

    var $fs;

    beforeEach(function() {
        angular.mock.module(module.name);
        angular.mock.inject(['$fs',function(fs) {
            $fs = fs;
        }]);
    });

    describe('reading',function() {
        it('should return the parsed read data',function() {
            return $fs.read('foo').then(function(res) {
                expect(res).toEqual('dummydata');
            });
        });
        it('should reject if something fails',function() {
            fsMock.read.andReturn(Q.reject('squeek'));
            return $fs.read('foo').catch(function(err) {
                expect(err).toEqual('squeek');
            });
        });
    });

    describe('writing',function() {
        it('should call the write spy and append a line end',function() {
            return $fs.write('filename','lalal').then(function() {
                expect(fsMock.write).toHaveBeenCalledWith('filename','"lalal"\n');
            });
        });
        it('should reject if something fails',function() {
            fsMock.write.andReturn(Q.reject('squeek'));
            return $fs.write('filename','lalal').catch(function(err) {
                expect(err).toEqual('squeek');
            });
        });
    });
});
