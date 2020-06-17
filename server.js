const https = require('https');
const http = require('http');
const url = require('url');
const path = require('path');
const app = require('./app');
const fs = require('fs');
const config = require('config');
const socketIO = require('socket.io');
const mysql = require('mysql');
const database = require('./app/middlewares/database');
const common = require("./app/middlewares/common");

const   httpport = process.env.PORT || config.get('host').httpport || 1210,
        httpsport = process.env.SECURE_PORT || config.get('host').httpsport || 1280;


var mysqlCon = database.getDBConnection(config);

let baseDir = "./app/public";
let activeSockets = [];
let activeUsers = new Object();

let httpServer = http.createServer(function (request, response)
{
    var uri = url.parse(request.url);

    var filePath = path.join(baseDir, uri.pathname);
    if (String(uri.pathname).endsWith('/') ||
            String(uri.pathname).endsWith("/admin")) 
    {
        filePath = path.join(filePath, 'index.html');
    }

    console.log('filePath ', filePath);

    var extname = String(path.extname(filePath)).toLowerCase();
    var mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    var contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT') {
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(404, { 'Content-Type': 'text/html' });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });
});

httpServer.listen(httpport, function(err) {
    if (err) {
        throw err;
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
        mysqlCon.getConnection(function(err, connection)
        {
            if (err) throw err;
            if (data.user.toLowerCase() === "admin" && data.password === "admin")
            {
                var token = common.getHashString(data);
                socket.emit("loggedin", 
                {
                    role: "admin",
                    token: token
                });

                activeUsers[socket.id] = token;

                return;
            }

            connection.query("select * from patroleum.users where email='" + data.user + "' and password='" + data.password + "'", function(err, result)
            {
                connection.release();

                if (err) throw err;

                if (Object.keys(result).length > 0)
                {
                    var role = result.role == 0 ? "admin" : "client";
                    socket.emit("loggedin", 
                    {
                        role: role,
                        token: common.getHashString(data)
                    });
                }
                else
                {
                    socket.emit("incorrect-user");
                }
            });
        });
    });

    socket.on("logout", (data) =>
    {
        //console.log('logout');
    });

    socket.on("disconnect", () =>
    {
        activeSockets = activeSockets.filter(soc => soc !== socket.id);

        //console.log('socket disconnected.');
    });

    socket.on("register-home", (data) =>
    {
        if (!common.validateToken(data.token))
            return;

        mysqlCon.getConnection(function(err, connection){
            if (err) throw err;

            var sha = common.getHashString(data);
            
            connection.query("select * from patroleum.homes where sha='" + sha + "'", function(err, result)
            {
                if (err)
                {
                    socket.emit("server-error", {
                        error: err.message
                    });
                    return;
                }
                
                if (result.length > 0)
                {
                    socket.emit("exist-record-register-home");
                    return;
                }

                connection.query("insert into patroleum.homes(address1, address2, city, state, postcode, country, sha) values('" + 
                    data.address1 + "', '" + data.address2 + "', '" + data.city + "', '" + data.state + "', '" +
                    data.postcode + "', '" + data.country + "', '" + sha + "')", function(err, result)
                {
                    if (err)
                    {
                        //throw err;
                        socket.emit("fail-register-home", {
                            error: err.message
                        });
                    }
                    else
                    {
                        connection.query("")
                        socket.emit("ok-register-home", {
                            sha: sha
                        });        
                    }

                    connection.release();
                });
            });
            
        });

    
    });
});