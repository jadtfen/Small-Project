$.ajax({
    type: 'POST',
    url: './api/session.php',
    contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify({}),
    complete: function(xhr, status){
        const sessionActive = xhr.responseJSON.sessionActive;
        // Request worked, no session was found
        if (sessionActive === false){
            window.location.assign("login.html");
        }
        else if (sessionActive === undefined){
            location.reload(true);
        }
        // Session exists, keep loading page
        else {
            window.location.assign("contacts.html");
        }
    }
});