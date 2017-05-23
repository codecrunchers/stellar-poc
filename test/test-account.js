var common = require('../common').appCommon;
var accountManager = require('../stellar/stellar').accountManager
var balanceManager = require('../stellar/stellar').balanceManager
var transferManager  = require('../stellar/stellar').transferManager;
var StellarSdk = require('stellar-sdk');



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

describe('Transfer Manager',function(){
    it('Should be available',function(){
        expect(transferManager).to.not.equal(undefined);
    })
    it('Should call my function after a transfer',function(){
        var from = StellarSdk.Keypair
            .fromSecret('SCIK63X7SAVXMLOA74BNBC72Z4YBB2O7GK3RSGV6JALYFEMC4BUZLWMJ');
        var to =  StellarSdk.Keypair
            .fromSecret('SAMIXTTBCKH32YEVJR7FCULEE4RS7WIMSXSIOPI3CTD6KWDTDFMYXDZ3');
        var gotCallBack = false;
        transferManager.transfer(from,to,100,{},function(){
            gotCallBack =true;
        })
        expect(gotCallBack).to.be.true;
    });
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

