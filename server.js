const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const config = require('config');
const socketIO = require('socket.io');
const mysql = require('mysql');

const   httpport = process.env.PORT || config.get('host').httpport || 1210,
        httpsport = process.env.SECURE_PORT || config.get('host').httpsport || 1280;

var mysqlCon = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'uos19851210',
    port: 3306
});

mysqlCon.connect(function(error)
{
    if (error) throw error;
    console.log("MySQL Connected!");

    mysqlCon.query("CREATE DATABASE patroleum CHARACTER SET utf8", function (err, result) 
    {
        if (err) 
            console.log(err.name + "," + err.message);
        console.log("Database Created!");
        mysqlCon.query("use patroleum");
        mysqlCon.query("CREATE TABLE users(`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `email` varchar(128) not null, `name` varchar(128) not null, `password` varchar(128) not null, `address` varchar(256) not null)", function(err, result)
        {
            if (err)
                console.log(err.name + "," + err.message);
            console.log("Users Table Created!");
        });
    });

    mysqlCon.query("USE patroleum");

});

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
    console.log('socket connected:' + socket.id);

    const existingsocket = activeSockets.find(soc => soc == socket.id);
    if (!existingsocket)
    {
        activeSockets.push(socket.id);
    }

    socket.on("login", (data) =>
    {
        console.log('login' + data.user + "," + data.password);

        mysqlCon.query("select * from users where email='" + data.user + "' and password='" + data.password + "'", function(err, result)
        {
            if (err) throw err;

            if (result)
            {
                console.log(result);
                console.log(socket.id);
                socket.emit("loggedin", 
                {
                    status: 0
                });
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

