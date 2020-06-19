'use strict';

const socket = io.connect(location.host);

socket.on('server-error', ( {error}) =>
{
    showAlert("Server Error!", error, "alert-danger");
})

socket.on("all-home-data", async (data) =>
{
    console.log(data);

    var userAddressListEl = document.getElementById("select-user-addresses");
    var cameraAddressListEl = document.getElementById("select-camera-addresses");
    
    for (var i = 0; i < data.length; i++)
    {
        var info = data[i];
        var option1 = document.createElement("option");
        var option2 = document.createElement("option");

        if (!info.address2 || info.address2 === "")
        {
            option1.innerText = info.address1 + ", " + info.city + ", " + info.state + ", " + info.country;
            option2.innerText = info.address1 + ", " + info.city + ", " + info.state + ", " + info.country;
        }
        else
        {
            option1.innerText = info.address1 + ", " + info.address2 + ", " + info.city + ", " + info.state + ", " + info.country;
            option2.innerText = info.address1 + ", " + info.address2 + ", " + info.city + ", " + info.state + ", " + info.country;
        }
        option1.value = info.sha;        
        option2.value = info.sha;
        
        userAddressListEl.appendChild(option1);
        cameraAddressListEl.appendChild(option2);
    }
});

function showAlert($header, $content, $type)
{
    hideAlert();
    var div = document.createElement("div");
    var innerHtml = "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button>";
    innerHtml = innerHtml + "<strong>" + $header + "</strong> " + $content;
    div.innerHTML = innerHtml;
    
    div.className = "alert " + $type + " alert-dismissible fade show fixed-bottom container";
    div.id = "myAlert";
    div.style = "margin-bottom: 40px; margin-right: 10px; width: 600px;";

    var root = document.getElementById('user');
    
    root.appendChild(div);

    setTimeout(() => {
        hideAlert();
    }, 5000);
}

function hideAlert()
{
    $("#myAlert").alert('close');
}

function getToken()
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    return urlParams.get('_token');
}

function getAllHomeAddresses()
{
    socket.emit("get-all-home-data",
    {
        token: getToken()
    })
}

window.onload = () => {
    initCameraRegisterForm();
    initHouseRegisterForm();
    initUserRegisterForm();

    getAllHomeAddresses();
}