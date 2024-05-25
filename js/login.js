$(document).ready(function() {
    $("#loginForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: './api/login.php',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                username: $('#username').val(),
                password: $('#password').val(),
            }),
            success: function(response) {
                $('#loginForm')[0].reset();
                window.location.assign("contactpage.html");
            },
        });
    });
});
