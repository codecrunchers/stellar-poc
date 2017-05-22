var $getAccountBtn = $('#getAccountBtn');
var $getBalanceBtn = $('#getBalanceBtn');

var $popup =$('#popup');
var appendthis =  ("<div class='modal-overlay js-modal-close'></div>");


var MSEApp = function() {
    _accountId  = -1;
    return {
        init: (function(){
            $( document ).ready(function() {
                console.log( "ready!" );
                $getAccountBtn.click(getAccount);
                $getBalanceBtn.click(getBalance);
                doDemoPopUp();
            });
            console.log("go");
        })(),
        accountId: function(){
            return this._accountId;
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
            $('#accountId').append("Secret: " + json.secretKey);

            $getAccountBtn.hide();
            $('#youraccount').removeClass('greyed');

        });
    }
    function getBalance(){
        console.log("balance for",_accountId);
        $.get( "/account/"+_accountId+"/balance", function( data ) {
            console.log("/balance raw",data)
            json = $.parseJSON(data);
            if(json.error){
                console.log("Err",json.error);
            }else{
                $('#_balance').html(json.balance);
            }
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