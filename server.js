const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const config = require('config');
const socketIO = require('socket.io');
const mysql = require('mysql');
const database = require('./app/middlewares/database');

const   httpport = process.env.PORT || config.get('host').httpport || 1210,
        httpsport = process.env.SECURE_PORT || config.get('host').httpsport || 1280;


var mysqlCon = database.getDBConnection(config);

let activeSockets = [];
let httpServer = http.createServer(app);
httpServer.listen(httpport, function(err) {
    if (err) {
        throw err
    }

    console.log('Insecure server is listening on port ' + httpport + "...");
});


let io = socketIO(httpServer);
io.on("connection", socket =>
{
    //console.log('socket connected:' + socket.id);

    const existingsocket = activeSockets.find(soc => soc == socket.id);
    if (!existingsocket)
    {
        activeSockets.push(socket.id);
    }

    socket.on("login", (data) =>
    {
        mysqlCon.query("select * from patroleum.users where email='" + data.user + "' and password='" + data.password + "'", function(err, result)
        {
            if (err) throw err;
            if (Object.keys(result).length > 0)
            {
                socket.emit("loggedin", 
                {
                    status: 0
                });
            }
            else
            {
                socket.emit("incorrect-user");
            }
        });
    });

    socket.on("logout", (data) =>
    {
        console.log('logout');
    });

    socket.on("disconnect", () =>
    {
        activeSockets = activeSockets.filter(soc => soc !== socket.id);

        console.log('socket disconnected.');
    });
});

