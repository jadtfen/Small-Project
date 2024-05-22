let logoutHeader;
$.ajax({
    type: 'POST',
    url: './api/logout.php',
    dataType: 'json',
    success: function(response) {
        logoutHeader = "You have been logged out successfully";
    },
    error: function(xhr) {
        logoutHeader = "Logout failed. Refresh this page to retry logout"
    }
})
.done(function(data) {
    $(document).ready(function() {
        $('.logout-header').eq(0).html(logoutHeader);
    });
});