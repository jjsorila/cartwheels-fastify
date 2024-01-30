$(function (e) {
    const sign_in_btn = document.querySelector("#sign-in-btn");
    const sign_up_btn = document.querySelector("#sign-up-btn");
    const container = document.querySelector(".container");
    const regFullname = $("#reg-fullname");
    const regBusinessName = $("#reg-businessName");
    const regPassword = $("#reg-password");
    const regEmail = $("#reg-email");
    const logEmail = $("#log-email");
    const logPassword = $("#log-password");

    function clearInput() {
      regBusinessName.val("");
      regFullname.val("");
      regEmail.val("");
      regPassword.val("");
      logEmail.val("");
      logPassword.val("");
    }

    sign_up_btn.addEventListener("click", () => {
      container.classList.add("sign-up-mode");
    });

    sign_in_btn.addEventListener("click", () => {
      container.classList.remove("sign-up-mode");
    });

    $("#signup-form,#signin-form").submit(function (e) {
      e.preventDefault();
    });

    //REGISTER BUTTON 
    //ENDPOINT: /api/vendor/register
    //METHOD: POST
    //DESCRIPTION: This piece of code will register a new vendor to the system
    $("#register-btn").click(function (e) {

      if(!regFullname.val() || !regEmail.val() || !regBusinessName.val() || !regPassword.val()) return Swal.fire({
        icon: "error",
        title: "Please complete all input",
      });

      Swal.fire({
        title: "Are all these inputs correct?",
        showDenyButton: true,
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          $.ajax({
            type: "POST",
            url: "/api/vendor/register",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              fullname: regFullname.val(),
              email: regEmail.val(),
              businessName: regBusinessName.val(),
              password: regPassword.val(),
            }),
            success: function (data) {
              if (data.operation) {
                clearInput()
                Swal.fire("Account created!", "", "success");
              }else{
                Swal.fire(data.msg, "", "error");
              }
            },
            error: function (error) {
              alert("Something went wrong");
              console.log(error);
            },
          });
        }
      });
    });

    //LOGIN BUTTON 
    //ENDPOINT: /api/vendor/auth
    //METHOD: POST
    //DESCRIPTION: This piece of code will login a vendor to the system
    $("#login-btn").click(function(e) {
      if(!logEmail.val() ||!logPassword.val()) return Swal.fire("Please complete all input", "", "error");

      $.ajax({
        type: "POST",
        url: "/api/vendor/auth",
        headers: {
          "Content-Type": "application/json"
        },
        data: JSON.stringify({
          email: logEmail.val(),
          password: logPassword.val()
        }),
        success: function (data) {
          if (data.operation) {
            clearInput()
            location.reload(1)
          }else{
            Swal.fire(data.msg, "", "error");
          }
        },
        error: function (error) {
          alert("Something went wrong");
          console.log(error);
        },
      })
    })
});
