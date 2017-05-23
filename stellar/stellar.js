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

            if(isDemoMode == true){
                console.log('#### DEMO MODE ###');
                seedAccount(pair,20);
                console.log("Private Key:", pair.secret());
            }

            console.log("Public Key:", pair.publicKey());
            return pair;

        },
        getAccount: function(accountId){
            return server.loadAccount(accountId);
        }
    }
    function seedAccount(pair,credit){
        console.log("@SeedAccount with",pair);

        if(pair == undefined || pair.publicKey().length !=56){
            handleError("Invalid Key")
                return;
        }
        var friendBot = horizonURL+'/friendbot?addr='+pair.publicKey();
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
        getBalance: function(pair,  callback){
            var balance = 0;
            var pKey = pair.publicKey;
            if(seeded == false){
                console.log("Not seeded");
                callback({balance:NaN,error:"Not Seeded"});
                return;
            }
            //TODO: number of accounts
            server.loadAccount(pKey).then(function(account) {
                account.balances.forEach(function(balance) {
                    console.log('Balance Type:', balance.asset_type, ', Balance:', balance.balance);
                    callback(balance);
                });
            });
        }
    }
}


var TransactionManager = function(){
    return {
        transfer: function(from, to, amount, details, callback){
            server.loadAccount(to.publicKey())
            .catch(StellarSdk.NotFoundError, function (error) {
                throw new Error('The destination account does not exist!');
            })
            // If there was no error, load up-to-date information on your account.
            .then(function() {
                return server.loadAccount(from.publicKey());
            })
            .then(function(sourceAccount) {
                // Start building the transaction.
                var transaction = new StellarSdk.TransactionBuilder(sourceAccount)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: to.publicKey(),
                        // Because Stellar allows transaction in many currencies, you must
                        // specify the asset type. The special "native" asset represents Lumens.
                        asset: StellarSdk.Asset.native(),
                        amount: amount
                    }))
                // A memo allows you to add your own metadata to a transaction. It's
                // optional and does not affect how Stellar treats the transaction.
                .addMemo(StellarSdk.Memo.text('Standard Test Transaction'))
                    .build();
                // Sign the transaction to prove you are actually the person sending it.
                transaction.sign(from);
                // And finally, send it off to Stellar!
                callback(server.submitTransaction(transaction));
            })
            .then(function(result) {
                console.log('Success! Results:', result);
            })
            .catch(function(error) {
                console.error('Something went wrong!', error);
            });
        },
        isFulfilled: function(callback){
            var serverKeys = common.serverKeys();
            server.transactions()
                .forAccount(serverKeys.publicKey())
                .call().then(callback);

        }
    }
}

function handleError(e){
    console.log("---------Error",e);
}

accountManager = AccountManager();
balanceManager = BalanceManager();
transferManager = TransactionManager();

exports.accountManager = accountManager;
exports.balanceManager = balanceManager;
exports.transferManager = transferManager;




