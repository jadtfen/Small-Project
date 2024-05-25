$(document).ready(function() {
    $('#registrationForm').submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: './api/register.php',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                firstName: $('#firstName').val(),
                lastName: $('#lastName').val(),
                username: $('#username').val(),
                password: $('#password').val(),
            }),
            success: function(response) {
                alert(response.message); 
                $('#registrationForm')[0].reset();
                window.location.href = "login.html"; // redirect to login page
            },
        });
    });
});
