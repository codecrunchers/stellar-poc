var accountManager = require('../index').accountManager
var expect    = require("chai").expect;

describe('appAccount', function() {

    it('Should be available',function(){
        expect({x:'y'}).to.not.equal(undefined);
    })

    it('should return an Object with keys on create account',function(){
        var keyObj = accountManager.createAccount();
        expect(keyObj.publicKey.length).to.equal(56);
        expect(keyObj.secretKey.length).to.equal(56);
    })

});

