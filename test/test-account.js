var common = require('../common').appCommon;
var accountManager = require('../index').accountManager
var balanceManager = require('../index').balanceManager

var expect = require("chai").expect;

describe('Common',function(){
    it('isDemoMode Should be true',function(){
        var demoMode = common.isDemoMode();
        expect(demoMode).to.be.true;
    })
});


describe('Balance Manager',function(){
    it('Should be available',function(){
        expect(balanceManager).to.not.equal(undefined);
    })
});

describe('appAccount', function() {

    it('Should be available',function(){
        expect(accountManager).to.not.equal(undefined);
    })

    it('Should call FriendlyBot to seed account',function(){
        var called = false;
        accountManager.seedAccount(
                {publicKey:"GAUT5TLW7MFFYPSGOEYK4WVO4CEKUEGTBDOARTFE22IVVHRDPS4N5EXZ"},
                200,
                function(){
                    called = true;
                }
                );
        expect(called).to.be.true;
    })


    it('should return an Object with keys on create account',function(){
        var keyObj = accountManager.createAccount();
        expect(keyObj.publicKey.length).to.equal(56);
        expect(keyObj.secretKey.length).to.equal(56);
    })

    it('Should Credit a New Account if in test mode',function(){
        var keyObj = accountManager.createAccount();
        var accountBalance =  balanceManager.getBalance(keyObj);
        expect(accountBalance).to.equal(10000);
    })
});

