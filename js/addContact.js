$(document).ready(function() {
    $("#newContactForm").submit(function(e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: './api/addContact.php',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({
                userId: userId,
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                email: $("#email").val(),
                phone: $("#phone").val(),
            }),
            success: function(response) {
                $('#newContactForm')[0].reset();
                window.location.assign("contacts.html");
            },
            error: function(xhr) {
                $('.error-text').html(xhr.responseJSON.message);
            }
        });
    });
});