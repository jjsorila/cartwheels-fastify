$(function (e) {
  let map, marker, infoWindow, currentLocation, locationName;
  const _id = $("#_id");
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
  const previewImg = function (file) {
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
  const imageHolder = $("#imageHolder");
  const fileInput = $("#fileInput");
  let chosenFile = null;
  const pImg = $("#p-img");
  const businessName = $("#businessName");
  const description = $("#description");
  const email = $("#email");
  const password = $("#password");
  const fullname = $("#fullname");

  function clearInput() {
    password.val("");
    fileInput.val(null);
    chosenFile = null;
  }

  imageHolder.click(function (e) {
    fileInput.click();
  });

  fileInput.change(function (e) {
    chosenFile = $(this).prop("files")[0];
    previewImg(chosenFile)
      .then((res) => {
        imageHolder.prop("src", res);
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

  //GMAPS API ======================================================================================================================================================================================================================================================

  async function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(initMap, showError, {
        enableHighAccuracy: true,
        maximumAge: 0,
      });
    } else {
      alert("Your browser does not support location feature");
    }
  }
  getLocation();

  async function initMap({ coords: { latitude: lat, longitude: lng } }) {
    currentLocation = { lat, lng };

    if (!map) {
      console.log("INIT MAP");
      const { Map } = await google.maps.importLibrary("maps");
      map = new Map(document.getElementById("map"), {
        center: currentLocation,
        zoom: 18,
      });
      marker = new google.maps.Marker({
        map,
        position: currentLocation,
      });
    }

    map.setCenter(currentLocation);

    //GET LOCATION DATA
    const mapData = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyB7Wj2Le4gM8suUtEehzZEZXr8dP9waA2M`
    ).then((res) => res.json());

    //DISPLAY LOCATION DATA
    infoWindow = new google.maps.InfoWindow();

    locationName = mapData?.plus_code?.compound_code;

    $("#locationName").text(mapData?.plus_code?.compound_code);

    //SHOW INFO WINDOW ON CLICK
    marker.addListener("click", () => {
      console.log(mapData);
      infoWindow.setContent(mapData?.plus_code?.compound_code);
      infoWindow.open({
        anchor: marker,
        map,
      });
    });

    //ENABLE BUTTONS
    $("button#update-location").attr("disabled", false);
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
    }
  }

  function updateLocation() {
    $.ajax({
      type: "POST",
      url: "/api/vendor/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        action: "map",
        _id: _id.val(),
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        locationName,
      }),
      success: (res) => {
        if (res.operation) {
          return Swal.fire(res.msg, "", "success");
        }
        return Swal.fire("Something went wrong", "", "error");
      },
      error: (error) => {
        alert("Server Error");
        console.log(error);
      },
    });
  }

  $("#update-location").click(function (e) {
    $("#locationName").text("Updating Location...");
    $(this).attr("disabled", true);
    getLocation().then(() => {
      updateLocation();
    });
  });

  $("#update-business").click(function (e) {
    if (!businessName.val() || !description.val())  return Swal.fire("Complete all fields!", "", "warning");

    const data = new FormData();
    if (chosenFile) {
      data.append("img", chosenFile);
    }
    data.append("businessName", businessName.val());
    data.append("description", description.val());
    data.append("_id", _id.val());
    data.append("action", "business");

    $.ajax({
      type: "POST",
      url: "/api/vendor/update",
      enctype: "multipart/form-data",
      processData: false,
      contentType: false,
      cache: false,
      data: data,
      success: (res) => {
        if (res.operation) {
          // return Swal.fire(res.msg, "", "success");
          return location.reload(true)
        }
        return Swal.fire("Something went wrong", "", "error");
      },
      error: (error) => {
        alert("Server Error");
        console.log(error);
      },
    });
  });

  $(".update-vendor").click(function(e) {
    if(!email.val() || !fullname.val()) return Swal.fire("Complete all fields!", "", "warning");
    
    $.ajax({
      type: "POST",
      url: "/api/vendor/update",
      contentType: "application/json",
      data: JSON.stringify({
        _id: _id.val(),
        action: "vendor",
        fullname: fullname.val(),
        email: email.val(),
        password: password.val() ? password.val() : null
      }),
      success: (res) => {
        if (res.operation) {
          return Swal.fire(res.msg, "", "success");
        }
        return Swal.fire("Something went wrong", "", "error");
      },
      error: (error) => {
        alert("Server Error");
        console.log(error);
      },
    });
  })

  // ====================================================================================================================================================================================================================================================== ====================================================================================================================================================================================================================================================== ======================================================================================================================================================================================================================================================

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

  form.click(function (e) {
    $(this).fadeToggle("fast");
  });

  $(".toggle-switch").click(function (e) {
    const status = JSON.parse(localStorage.getItem("darkmode"));
    localStorage.setItem("darkmode", JSON.stringify(!status));
  });
});
