'use strict';

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

window.onload = () => {
    initHouseRegisterForm();
    initUserRegisterForm();


}