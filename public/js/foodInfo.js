$(function(e) {
    let map, watchId, directionsService, directionsRenderer, currentLocation, dest;
    dest = { lat: Number($("#lat").val()), lng: Number($("#lng").val()) }

    $("#home").click(function(e) {
        location.href = "/"
    })

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
        const request = {
            origin: currentLocation,
            destination: dest,
            travelMode: "WALKING"
        }
    
        if (!map) {
          console.log("INIT MAP");
          const { Map } = await google.maps.importLibrary("maps");
          const { DirectionsService, DirectionsRenderer } = await google.maps.importLibrary("routes");

          map = new Map(document.getElementById("map"), {
            center: currentLocation,
            zoom: 18,
          });

            directionsService = new DirectionsService();
            directionsRenderer = new DirectionsRenderer({
                preserveViewport: true,
                map
            });

            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                directionsRenderer.setDirections(response);
                }
            });

            map.setCenter(currentLocation);

            const locationButton = document.createElement("button");

            locationButton.textContent = "Pan to Current Location";
            locationButton.classList.add("custom-map-control-button");

            map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(locationButton);

            locationButton.addEventListener("click", () => {
                map.setCenter(currentLocation);
            });

            watchId = setInterval(getLocation, 1000)
        }else{
            console.log("UPDATE LOCATION")
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    directionsRenderer.setDirections(response);
                }
            });
        }
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
})