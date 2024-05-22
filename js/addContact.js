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
                alert(response.message); 
                $('#newContactForm')[0].reset();
                // window.location.href = "login.html"; // redirect to contact page
            },
            error: function(xhr) {
                alert(xhr.responseJSON.message);
            }
        });
    });
});