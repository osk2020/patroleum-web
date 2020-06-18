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
    maleEl = document.getElementById("radio-user-gender-male");
    femaleEl = document.getElementById("radio-user-gender-female");
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

        gender = 'male';
        if (femaleEl.checked == true)
            gender = 'female';

        
        socket.emit("register-user", {
            token: getToken(),
            firstname: firstname,
            lastname: lastname,
            email: email,
            phonenumber: phonenumber,
            dispname: dispname,
            password: password,
            gender: gender,
            address: address
        });
        
    }

    socket.on("ok-register-user", () => {
        showAlert("Success!", "The User Info has been successfully registered", "alert-success");
    });

    socket.on("fail-register-user", ({error}) => {
        showAlert("Fail!", error, "alert-danger");
    });
}