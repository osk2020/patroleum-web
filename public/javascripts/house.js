'use strict';

function initHouseRegisterForm()
{
    var address1El, address2El, cityEl, divHomeFormEl,
    stateEl, postcodeEl, countryEl, registerEl;

    var address1, address2, city, state, postcode, country;

    address1El = document.getElementById("txt-home-address-1");
    address2El = document.getElementById("txt-home-address-2");
    cityEl = document.getElementById("txt-home-city");
    stateEl = document.getElementById("txt-home-state");
    postcodeEl = document.getElementById("txt-home-postcode");
    countryEl = document.getElementById("txt-home-country");
    registerEl = document.getElementById("btn-home-register");
    divHomeFormEl = document.getElementById("div-home-form");

    registerEl.onclick = function ($event) {
        address1 = address1El.value;
        address2 = address2El.value;
        city = cityEl.value;
        state = stateEl.value;
        postcode = postcodeEl.value;
        country = countryEl.value;

        if (!address1 || address1 === "" ||
            !city || city === "" || !state || state === "" || 
            !postcode || postcode === "" || !country || country === "")
        {
            return;
        }

        socket.emit("register-home", {
            token: getToken(),
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country
        });
    }

    socket.on("ok-register-home", ({sha}) => {
        showAlert("Success!", "The Home Address has been successfully registered", "alert-success");

        var userAddressListEl = document.getElementById("select-user-addresses");
        var option = document.createElement("option");

        if (!address2 || address2 === "")
        {
            option.innerText = address1 + ", " + city + ", " + state + ", " + country;
        }
        else
        {
            option.innerText = address1 + ", " + address2 + ", " + city + ", " + state + ", " + country;
        }
        option.value = sha;        
        userAddressListEl.appendChild(option);
    });

    socket.on("fail-register-home", ({error}) => {
        showAlert("Fail!", error, "alert-danger");
    });

    socket.on("exist-record-register-home", () =>
    {
        showAlert("Warning!", "This Address exist already in Database", "alert-warning");
    });

}