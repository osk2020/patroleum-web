'use strict';

var isStreamming = false;
var player;
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
        $event.preventDefault();

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

    testconnEl.onclick = function ($event)
    {
        $event.preventDefault();

        if (isStreamming == false)
        {
            uri = urlEl.value;
            if (!uri || uri === "")
            {
                return;
            }

            socket.emit("test-connection", {
                token: getToken(),
                uri: uri
            });

            testconnEl.value = "Stop";
        }
        else
        {
            player.destroy();
            socket.emit("test-disconnection", {
                token: getToken()
            });

            isStreamming = false;
            testconnEl.value = "Test Connection";
        }
    }

    socket.on("ok-register-camera", ({sha}) => {
        showAlert("Success!", "The Camera Details has been successfully registered", "alert-success");
    });

    socket.on("fail-register-camera", ({error}) => {
        showAlert("Fail!", error, "alert-danger");
    });

    socket.on('start-streaming', ({ port }) =>
    {
        var canvas = document.getElementById("video-canvas");
        var url = 'ws://' + document.location.hostname + ":" + port + "/";
        console.log(url);

        player = new JSMpeg.Player(url, { canvas: canvas, vidoeBufferSize: 10 * 1024 * 1024, audio: false, disableGL: true });
        isStreamming = true;
    });
}