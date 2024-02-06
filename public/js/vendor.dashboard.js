$(function (e) {
  const body = document.querySelector("body");
  //CACHE DARK MODE STATUS
  const darkModeStatus = JSON.parse(localStorage.getItem("darkmode"));
  if (darkModeStatus) {
    body.classList.add("dark");
  } else {
    body.classList.remove("dark");
  }

  const sidebar = body.querySelector(".sidebar");
  const jquerySidebar = $(".mobile-view");
  let toggle = body.querySelector(".toggle");
  let modeSwitch = body.querySelector(".toggle-switch");
  const modeText = body.querySelector(".mode-text");
  const reader = new FileReader();
  const form = $(".shadow");
  const fileInput = $("#fileInput");
  const fileClick = $("#fileClick");
  const imgTag = $("#fileClick img");
  const previewImg = (file) => {
    return new Promise((resolve, reject) => {
      reader.readAsDataURL(file);
      reader.onload = (data) => {
        resolve(data.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  };
  const newProduct = $("#newProduct");

  function clearInput() {
    newProduct.val("");
    fileInput.val(null);
    imgTag.prop("src", "/public/img/default_image.png");
  }

  fileClick.click(function (e) {
    fileInput.click();
  });

  fileInput.change(function (e) {
    previewImg($(this).prop("files")[0])
      .then((data) => {
        imgTag.prop("src", data);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  $("#logout").click(function (e) {
    $.ajax({
      type: "DELETE",
      url: "/api/vendor/logout",
      success: function (data) {
        if (data.operation) {
          location.reload(true);
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

  toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
  });

  modeSwitch.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
      modeText.innerHTML = "Light Mode";
    } else {
      modeText.innerHTML = "Dark Mode";
    }
  });

  $("#upload-img").click(function (e) {
    $("#input-img").click();
  });

  $("#bars").click(function (e) {
    jquerySidebar.fadeToggle(500);
    jquerySidebar.css({
      position: "fixed",
      "min-width": "230px",
      display: "block",
    });
    jquerySidebar.toggleClass("close");
  });

  function handleResize() {
    var screenWidth = $(window).width();

    // Set display property based on screen width
    if (screenWidth > 481) {
      jquerySidebar.css("display", "none");
      jquerySidebar.toggleClass("close");
    }
  }
  handleResize();
  $(window).resize(handleResize);

  $("#xxx").click(function (e) {
    jquerySidebar.fadeToggle(500);
    jquerySidebar.toggleClass("close");
  });

  $(".table-container").on("click", "#edit", function (e) {
    form.fadeToggle("fast");
  });

  $(".form").click(function (e) {
    e.stopPropagation();
  });

  $(".form").submit(function (e) {
    e.preventDefault();
  });

  $(".form").submit(function (e) {
    e.preventDefault();
  });

  $("#apply").click(function (e) {
    alert("ASDASD");
  });

  form.click(function (e) {
    $(this).fadeToggle("fast");
    clearInput();
  });

  $(".toggle-switch").click(function (e) {
    const status = JSON.parse(localStorage.getItem("darkmode"));
    localStorage.setItem("darkmode", JSON.stringify(!status));
  });
});
