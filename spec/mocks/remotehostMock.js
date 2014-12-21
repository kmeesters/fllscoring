function createRemotehostMock($q) {
    return {
        read: jasmine.createSpy('remotehostRead').andReturn($q.when()),
        readChallenge: jasmine.createSpy('remotehostReadChallenge').andReturn($q.when()),
        list: jasmine.createSpy('remotehostList').andReturn($q.when())
    };
}
