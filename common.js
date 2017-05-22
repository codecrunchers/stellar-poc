var StellarSdk = require('stellar-sdk');

var isDemoMode = true;
var stellarServer = new StellarSdk.Server('https://horizon-testnet.stellar.org');
StellarSdk.Network.useTestNetwork();


var AppCommon = function(){
    return {
        isDemoMode: function(){return isDemoMode;},
        server: function(){ return stellarServer;}
    }
}
appCommon = AppCommon();
exports.appCommon = appCommon;
