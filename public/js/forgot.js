$(function(e) {
    const email = $("#email")
    const pwd = $("#pwd")
    const confirmPwd = $("#confirmPwd")

    $("form").submit(function(e) {
        e.preventDefault()
    })

    $("#submit").click(function(e) {
        if(!pwd.val() || !confirmPwd.val()) return Swal.fire("Complete all input", "", "warning")
        if(pwd.val() != confirmPwd.val()) return Swal.fire("Password not matched", "", "error")

        $.ajax({
            type: "PATCH",
            url: "/api/vendor/reset",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                email: email.val(),
                password: pwd.val()
            }),
            success: (res) => {
                if(res.operation){
                    return Swal.fire({
                        title: "Password changed",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            location.replace("/auth")
                        }
                    })
                }
                Swal.fire("Something went wrong", "", "error")
            },
            error: (error) => {
                console.log(error)
                Swal.fire("Something went wrong", "", "error")
            }
        })
    })
})