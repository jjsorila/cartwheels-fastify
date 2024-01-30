$(function (e) {

    //LOGOUT BUTTON
    //ENDPOINT: /api/vendor/logout
    //METHOD: DELETE
    //DESCRIPTION: Logs out the vendor from the system
    $("h1").click(function (e) {
        $.ajax({
        type: "DELETE",
        url: "/api/vendor/logout",
        success: function (data) {
            if (data.operation) {
            location.reload(1);
            } else {
            Swal.fire(data.msg, "", "error");
            }
        },
        error: function (error) {
            alert("Something went wrong");
            console.log(error);
        },
        });
    });
});
