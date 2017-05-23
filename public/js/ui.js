var $getAccountBtn = $('#getAccountBtn');
var $getBalanceBtn = $('#getBalanceBtn');
var $buyBtn = $('#enterMSEContractBtn');

var $popup =$('#popup');
var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");

var balanceTimer = null;

var MSEApp = function() {
    _accountId  = -1;

    return {
        init: (function(){
            $( document ).ready(function() {
                console.log( "ready!" );
                $getAccountBtn.click(getAccount);
                $buyBtn.click(buy);
                doDemoPopUp();
                $('#mseNowThen').html(
                        $('#usemse').prop('checked') ? 'When your happy' : 'Now');
                $('#usemse').click(function(e){
                    $('#mseNowThen').html(
                        $('#usemse').prop('checked') ? 'When your happy' : 'Now');
                });



                balanceTimer = setInterval(
                        function(){
                            $("#balSpinner").html('<img height="20px" width="20px" src="/images/spinner.gif" alt="Wait" />');
                            mseApp.balance();
                        },
                        2000);
            });
            console.log("go");
        })(),
        accountId: function(){
            return this._accountId;
        },
        balance: function(){
            return getBalance();
        }
    }
    function  doDemoPopUp(){
        $('a[data-modal-id]').click(function(e) {
            e.preventDefault();
            $("body").append(appendthis);
            $(".modal-overlay").fadeTo(500, 0.7);
            var modalBox = $(this).attr('data-modal-id');
            $('#'+modalBox).fadeIn($(this).data());
        });
    }
    function getAccount(){
        $.post( "/account", function( data ) {
            json = $.parseJSON(data);
            console.debug("/account",json);
            _accountId = json.publicKey;
            $('#accountId').append(_accountId);
            $('#accountSecret').append("Secret: " + json.secretKey);
            $getBalanceBtn.prop("disabled",false);
            $getAccountBtn.hide();
            $('#youraccount').removeClass('greyed');

        });
    }
    function getBalance(){
        if(_accountId  == -1)
        {
            return;
        }
        console.log("balance for",_accountId);

        $.get( "/account/"+_accountId+"/balance", function( data ) {
            console.log("/balance raw",data)
            json = $.parseJSON(data);
            $("#balSpinner").html('');
            if(json.error){
                console.log("Err",json.error);
            }else{
                $('#_balance').html(json.balance);
                $('#enterMSEContractBtn').prop( "disabled", false );
                clearInterval(balanceTimer);
            }
            $("#balSpinner").html('');

        });
    }
    function buy(){
        console.log("Purchase for",_accountId);
        $.post( "/transfer/100/" + $('#accountSecret').html().split(' ')[2], function( jsondata ) {
            var transfer = $.parseJSON(jsondata)
            if(transfer.isRejected == true){
                $('#productId').html("Purchase rejected");
            }else{
                status = transfer.isFulfilled;
                $('#productId').html("Status: " + status == true ? "Fulfilled" : "Pending Fulfill");

            }
            console.debug("/transfer repsonse",transfer);
            console.debug("/transfer feteching latest",transfer);
            $.get( "/transfer",
                    function(transferResponse){
                        obj = $.parseJSON(transferResponse);
                        obj.records.forEach(function(record){
                            if(record.sourceAccount == $('#accountSecret').html().split(' ')[3] && record.memo == 'Standard Test Transaction') {
                                $('#productId').html("Fulfilled");
                                deliverSmileyFace();
                            }
                        });
                    });

        });

    }
}

mseApp = MSEApp();

$(".js-modal-close, .modal-overlay").click(function() {
    $(".modal-box, .modal-overlay").fadeOut(500, function() {
        $(".modal-overlay").remove();
    });
});

$(window).resize(function() {
    $(".modal-box").css({
        top: ($(window).height() - $(".modal-box").outerHeight()) / 2,
        left: ($(window).width() - $(".modal-box").outerWidth()) / 2
    });
});

function deliverSmileyFace(){
    $('#smileyface').html('&#9786;');
}


