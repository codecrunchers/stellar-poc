var common = require('../common').appCommon;
var StellarSdk = require('stellar-sdk');
var horizonURL = 'https://horizon-testnet.stellar.org'
var isDemoMode = common.isDemoMode();
var server = common.server();
var request = require('request');
var curl = require('curl');
var seeded = false;

var AccountManager = function(){
    return {
        createAccount: function(){
            console.log("Creating Account");
            var pair = StellarSdk.Keypair.random();
            var keys =  {
                publicKey: pair.publicKey(),
                secretKey: pair.secret()
            }

            if(isDemoMode == true){
                console.log('#### DEMO MODE ###');
                seedAccount(keys,20);
                console.log("Private Key:", keys.secretKey);
            }

            console.log("Public Key:", keys.publicKey);
            return keys;

        },
        getAccount: function(accountId){
            return server.loadAccount(accountId);
        }
    }
    function seedAccount(accountObject,credit){
        console.log("@SeedAccount");

        if(accountObject.publicKey == undefined || accountObject.publicKey.length !=56){
            handleError("Invalid Key")
                return;
        }
        var friendBot = horizonURL+'/friendbot?addr='+accountObject.publicKey;
        console.log('Submitting to %s',friendBot);
        curl.get(friendBot, {} ,
                function (error, response, body) {
                    console.log('Seed statusCode:', response && response.statusCode); // Print the response status code if a response was received 
                    seeded = true;
                });
    }
}

var BalanceManager = function(){
    return {
        getBalance: function(accountObject, callback){

            var balance = 0;
            var pKey = accountObject.publicKey;
            if(seeded == false){
                console.log("Not seeded");
                callback({balance:NaN,error:"Not Seeded"});
                return;
            }
            //TODO: number of accounts
            console.log('Fetching Balances for account: %s',accountObject.publicKey );
            server.loadAccount(pKey).then(function(account) {
                console.log('Balances for account: ' + pKey);
                account.balances.forEach(function(balance) {
                    console.log('Type:', balance.asset_type, ', Balance:', balance.balance);
                    callback(balance);
                });
            });
        }
    }
}

function handleError(e){
    console.log("---------Error",e);
}

accountManager = AccountManager();
balanceManager = BalanceManager();

exports.accountManager = accountManager;
exports.balanceManager = balanceManager;




