'use strict';

function initCameraRegisterForm()
{
    var addressEl, urlEl, dispEl, locationEl, registerEl, testconnEl;

    var address, uri, dispname, location;

    addressEl = document.getElementById("txt-camera-address");
    urlEl = document.getElementById("txt-camera-url");
    dispEl = document.getElementById("txt-camera-dispname");
    locationEl = document.getElementById("txt-camera-location");
    registerEl = document.getElementById("btn-camera-register");
    testconnEl = document.getElementById("btn-camera-testconn");

    registerEl.onclick = function ($event) {
        address = addressEl.value;
        uri = urlEl.value;
        dispname = dispEl.value;
        location = locationEl.value;

        if (!address || address === "" || !uri || uri === "")
        {
            return;
        }

        socket.emit("register-camera", {
            token: getToken(),
            address: address,
            uri: uri,
            dispname: dispname,
            location: location,
        });
    }

    socket.on("ok-register-camera", ({sha}) => {
        showAlert("Success!", "The Camera Details has been successfully registered", "alert-success");
    });

    socket.on("fail-register-camera", ({error}) => {
        showAlert("Fail!", error, "alert-danger");
    });
}