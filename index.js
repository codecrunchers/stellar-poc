var express = require('express')
var app = express();
app.set('view engine', 'ejs')
app.use(express.static('public'))



var accountManager  = require('./stellar/stellar').accountManager;
var balanceManager  = require('./stellar/stellar').balanceManager;

var sourceKeys = accountManager.createAccount();


app.get('/',function(req,res){
  res.render('index', { title: 'Hey', message: 'Hello there!' })
})

app.post('/account', function (req, res) {
  var obj = accountManager.createAccount();
  res.send(JSON.stringify(obj));
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

app.post('/transfer/:amount/:to', function(req,req){
 
    var obj = balanceManager.getBalance({publicKey: req.params.accountId},function(obj){
      console.log("returning balance",obj);
      res.send(JSON.stringify(obj));
  });

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


function updateBalance(balance){
    console.log("Balance Received", balance);
}
