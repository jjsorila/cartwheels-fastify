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
  const addProductBtn = $("#add")
  const addInputFile = $("#input-img")
  const addImgHolder = $("#upload-img")
  const addProduct = $("#addProduct")
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
  const _id = $("#_id")

  function clearInput() {
    newProduct.val("");
    fileInput.val(null);
    imgTag.prop("src", "/public/img/default_image.png");
    addImgHolder.prop("src", "/public/img/default_image.png");
    addInputFile.val(null)
    addProduct.val("")
  }

  async function loadData() {
    $.ajax({
      type: "POST",
      url: "/api/vendor/products",
      contentType: "application/json",
      data: JSON.stringify({
        action: "read",
        _id: _id.val()
      }),
      success: (res) => {
        if(res.operation){
          $(".productContainer,.products-table,#prod-number").html(null)
          if(res.data.length > 0){
            $("#prod-number").html(res.data.length)

            res.data.forEach((v) => {
              $(".productContainer").append(`
              <div class="prod-card">
                  <div class="imge-container">
                      <img src="${v.productImage}" alt="">
                  </div>
                  <div class="product-nameContainer">
                      <h2>${v.name}</h2>
                  </div>
              </div>
              `)

              $(".products-table").append(`
              <div class="body-table">
                  <div>${v.name}</div>
                  <div class="action-btn">
                      <button product-id="${v._id}" product-image="${v.productImage}" product-name="${v.name}" class="edit" id="edit">
                          <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button product-id="${v._id}" class="delete" id="delete">
                          <i class="fa-solid fa-trash"></i>
                      </button>
                  </div>
              </div>
              `)
            })  
          }else{
            $(".productContainer").html(`<h1 class="noProducts">No Products</h1>`)
            $("#prod-number").html("0")
          }
        }else{
          Swal.fire("Something went wrong", "", "error")
        }
      },
      error: (error) => {
        alert("Server Error")
        console.log(error)
      }
    })
  }

  loadData()

  addProductBtn.click(function(e) {
    if(addInputFile.prop("files").length <= 0 || !addProduct.val()) return Swal.fire("Complete all input", "", "warning")

    const body = new FormData()
    body.append("_id", _id.val())
    body.append("action", "add")
    body.append("img", addInputFile.prop("files")[0])
    body.append("productName", addProduct.val())

    $.ajax({
      type: "POST",
      url: "/api/vendor/products",
      contentType: false,
      processData: false,
      cache: false,
      data: body,
      success: (res) => {
        if(res.operation){
          return loadData().then(() => {  
            clearInput()
            Swal.fire(res.msg,"","success")
          })
        }
        return Swal.fire("Something went wrong","","error")
      },
      error: (error) => {
        console.log(error)
        alert("Server Error")
      }
    })
  })

  $("div.products-table").on("click","button.edit", function(e) {
    $("#toUpdate").val($(this).attr("product-id"))
    imgTag.prop("src", $(this).attr("product-image"))
    newProduct.val($(this).attr("product-name"))
    form.fadeToggle("fast");
  })
  $("div.products-table").on("click","button.delete", function(e) {
    const productId = $(this).attr("product-id")

    $.ajax({
      type: "POST",
      url: "/api/vendor/products",
      contentType: "application/json",
      data: JSON.stringify({
        action: "delete",
        productId,
        _id: _id.val()
      }),
      success: (res) => {
        if(res.operation){
          return loadData().then(() => {  
            Swal.fire(res.msg,"","success")
          })
        }
        return Swal.fire("Something went wrong","","error")
      },
      error: (error) => {
        console.log(error)
        alert("Server Error")
      }
    })
  })

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

  addInputFile.change(function(e) {
    previewImg($(this).prop("files")[0])
      .then((data) => {
        addImgHolder.prop("src", data);
      })
      .catch((error) => {
        console.log(error);
      });
  })

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
    if(!newProduct.val()) return Swal.fire("Complete all input!", "", "warning")
    const body = new FormData()
    
    if(fileInput.prop("files").length > 0){
      body.append("img", fileInput.prop("files")[0])
    }
    body.append("action", "update")
    body.append("_id",_id.val())
    body.append("updateProductId", $("#toUpdate").val())
    body.append("newName", newProduct.val())

    $.ajax({
      type: "POST",
      url: "/api/vendor/products",
      contentType: false,
      processData: false,
      cache: false,
      data: body,
      success: (res) => {
        if(res.operation){
          return loadData().then(() => {  
            clearInput()
            Swal.fire(res.msg,"","success").then(() => {
              form.fadeToggle("fast")
            })
          })
        }
        return Swal.fire("Something went wrong","","error")
      },
      error: (error) => {
        console.log(error)
        alert("Server Error")
      }
    })
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
