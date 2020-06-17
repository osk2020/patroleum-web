'use strict';

function initUserRegisterForm()
{
    var addressEl, firstnameEl, lastnameEl, emailEl, phoneEl, 
        dispnameEl, passwordEl, confirmEl, maleEl, femaleEl, registerEl;

    var address, firstname, lastname, email, phonenumber, 
        dispname, password, confirmpwd, gender;

    addressEl = document.getElementById("select-user-addresses");
    firstnameEl = document.getElementById("txt-user-firstname");
    lastnameEl = document.getElementById("txt-user-lastname");
    emailEl = document.getElementById("txt-user-email");
    phoneEl = document.getElementById("txt-user-phonenumber");
    dispnameEl = document.getElementById("txt-user-dispname");
    passwordEl = document.getElementById("txt-user-password");
    confirmEl = document.getElementById("txt-user-confirm");
    maleEl = document.getElementById("radio-user-male");
    femaleEl = document.getElementById("radio-user-female");
    registerEl = document.getElementById("btn-user-register");

    registerEl.onclick = function ($event) {
        address = addressEl.value;
        firstname = firstnameEl.value;
        lastname = lastnameEl.value;
        email = emailEl.value;
        phonenumber = phoneEl.value;
        dispname = dispnameEl.value;
        password = passwordEl.value;
        confirmpwd = confirmEl.value;


        if (!address || address === "" || !firstname || firstname === "" ||
            !lastname || lastname === "" || !email || email === "" ||
            !phonenumber || phonenumber === "" || !dispname || dispname === "" ||
            !password || password === "" || !confirmpwd || confirmpwd === "")
        {
            return;
        }

        if (password != confirmpwd)
        {
            passwordEl.value = "";
            confirmEl.value = "";
        }

        /*
        socket.emit("register-home", {
            token: "",
            address1: address1,
            address2: address2,
            city: city,
            state: state,
            postcode: postcode,
            country: country
        });
        */
    }

    socket.on("ok-register-home", ({sha}) => {
        showAlert("Success!", "The Home Address has been successfully registered", "alert-success");

        var userAddressListEl = document.getElementById("user-addresses-list");
        var option = document.createElement("option");

        if (!address2 || address2 === "")
            option.innerText = address1 + ", " + city + ", " + state + ", " + country;
        else
            option.innerText = address1 + ", " + address2 + ", " + city + ", " + state + ", " + country;
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