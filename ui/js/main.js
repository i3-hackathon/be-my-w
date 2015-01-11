var getUserId = function(){
    return localStorage.getItem("user_id");
}

var getValues = function(){
    var values = {};    
    var forms = $("form");

    $.each(forms, function(i, form){
        if($(form).is('[slider]')){
            // console.debug('slider', form);
            return;
        }



        var action = $(form).attr('action') || '';
        if(action.indexOf('#!') == 0){
            action = action.slice(2);
            var checked = $(":checked", form);
            // console.debug(action, checked.attr('id'));
            values[action] = checked.attr('id') || '';
        }
    });
    return values;    
};

var setValues = function(values){
    $("input[type='radio']").prop('checked', false);
    $("input[type='checkbox']").prop('checked', false);

    $.each(values, function(key, value){
        $("#" + value).prop("checked", true);
    });

}

var postPreferences = function(preferences){
    var user = getUserId();
    var url = 'http://be-my-wife.herokuapp.com/preferences/' + user, preferences;

    $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(preferences),
      dataType: 'json'
    });
}

$(document).ready(function() {
    
    // Routing Logic

    $(window).hashchange(function() {
        var hash = location.hash;
        if (hash == '') hash = '#main';
        if ('#' + $('div[role=page].selected').attr('id') == hash) return;
        $(window).scrollTop(0);
        $('div[role=page]').removeClass('selected');
        $('div[role=page]' + hash).addClass('selected');
    });
    $(window).hashchange();


    // User Management Logic

    function submit_login_form() {
        $.ajax({
            type: 'GET',
            url: 'http://be-my-wife.herokuapp.com/login/' + $('#loginform').find('#email').val(),
            success: function(data) {
                $('#loginerror').hide();
                login_user(data.userid);
            },
            error: function() {
                $('#loginerror').show();
            }
        });
    }

    $('#loginform input').keydown(function(e) {
        if (e.which == 13) submit_login_form();
    });

    $('#loginform a.submit').click(function() {
        submit_login_form();
    });

    $('a.logout').click(function() {
        localStorage.removeItem('user_id');
        $('.loggedout').show();
        $('.loggedin').hide();
    });

    function adapt_page_to_logged_in_user(user_id) {
        $('.loggedout').hide();
        $('.loggedin').show();
    }

    function login_user(user_id) {
        localStorage.setItem('user_id', user_id);
        adapt_page_to_logged_in_user(user_id);
        window.location.hash = '#main';
    }

    function check_for_signed_in_user() {
        user_id = localStorage.getItem('user_id');
        if (user_id != null) {
            adapt_page_to_logged_in_user(user_id)
        } else {
            $('.loggedin').hide(); 
        }
    }
    check_for_signed_in_user();

    $("form").change(getValues);
});