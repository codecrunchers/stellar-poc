var StellarSdk = require('stellar-sdk');
var isDemoMode = true;
var stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();

var AppCommon = function(){
    keys = null;
    return {
        isDemoMode: function(){return isDemoMode;},
        server: function(){ return stellarServer;},
        serverKeys: function(){
            if(keys == null){
                var accountManager  = require('./stellar/stellar').accountManager;
                keys = accountManager.createAccount();
            }
            return keys;
        }
    }
}
appCommon = AppCommon();
exports.appCommon = appCommon;
