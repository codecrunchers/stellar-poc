var StellarSdk = require('stellar-sdk');
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');

var AccountManager = function(){
    return {
        createAccount: function(){
            console.log("Creating Account");
            var pair = StellarSdk.Keypair.random();
            return {
                publicKey: pair.publicKey(),
                secretKey: pair.secret()
            }
        }
    }
}

accountManager = AccountManager();
exports.accountManager = accountManager;
