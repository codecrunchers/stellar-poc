var express = require('express')
var app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))

var accountManager  = require('./stellar/stellar').accountManager;
var balanceManager  = require('./stellar/stellar').balanceManager;
var transferManager  = require('./stellar/stellar').transferManager;
var StellarSdk = require('stellar-sdk');



var serverKeys = accountManager.createAccount();
console.log("Using %s for server.",serverKeys.publicKey,balanceManager.getBalance(serverKeys,
            function(reply){
                if(reply.error){
                    console.log("Balance not available");
                }else{
                    console.log("Balance",reply.balance)
                }
            }));

app.get('/',function(req,res){
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

//Account
app.post('/account', function (req, res) {
  var obj = accountManager.createAccount();
  res.send(JSON.stringify({publicKey:obj.publicKey(),secretKey:obj.secret()}));
})

app.get('/account/:accountId', function (req, res) {
  var obj = accountManager.getAccount({publicKey: req.params.accountId});
  res.send(JSON.stringify(obj));
})

app.get('/account/:accountId/balance', function (req, res) {
  var obj = balanceManager.getBalance({publicKey: req.params.accountId},function(obj){
      console.log("returning balance",obj);
      res.send(JSON.stringify(obj));
  });
})


//transfers
app.post('/transfer/:amount/:fromPrivateKey', function(req,res){
    console.log('Processing transfer of $s for %s', req.params.amount, req.params.fromPrivateKey);
    var from = req.params.fromPrivateKey;
    var sourceKeys = StellarSdk.Keypair
        .fromSecret(from);
    var toKeys = StellarSdk.Keypair
        .fromSecret(serverKeys.secret());

    var obj = transferManager.transfer(sourceKeys,toKeys,req.params.amount,{},function(transferResponse){
      console.log("returning post transfer",transferResponse);
      res.send(JSON.stringify(transferResponse));
    });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


function updateBalance(balance){
    console.log("Balance Received", balance);
}
