'use strict';

const socket = io.connect(location.host);

socket.on('server-error', ( {error}) =>
{
    showAlert("Server Error!", error, "alert-danger");
})
