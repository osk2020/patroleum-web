const socketIO = require('socket.io');
const common = require("../middlewares/common");
const stream = require('../middlewares/stream');

module.exports.getSocketConnection = function(server, mysqlCon)
{
    let io = socketIO(server);
    io.on("connection", socket =>
    {
        //console.log('socket connected:' + socket.id);
        const existingsocket = global.activeSockets.find(soc => soc == socket.id);
        if (!existingsocket)
        {
            global.activeSockets.push(socket.id);
        }

        socket.on("login", (data) =>
        {
            mysqlCon.getConnection(function(err, connection)
            {
                if (err) throw err;
                var token = common.getHashString(data);
                if (data.user.toLowerCase() === "admin" && data.password === "admin")
                {
                    socket.emit("loggedin", 
                    {
                        role: "admin",
                        token: token
                    });

                    global.activeUsers[token] = JSON.stringify(
                    {
                        date: Math.floor(Date.now() / 1000),
                        user: data.user
                    });

                    return;
                }

                connection.query("select * from patroleum.users where (email='" + data.user + "' or dispname='" + data.user + "') and password='" + data.password + "'", function(err, result)
                {
                    connection.release();
                    if (err) throw err;
                
                    if (Object.keys(result).length > 0)
                    {
                        var role = result.role;
                        socket.emit("loggedin", 
                        {
                            role: role,
                            token: token
                        });

                        global.activeUsers[token] = JSON.stringify(
                        {
                            date: Math.floor(Date.now() / 1000),
                            user: data.user
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
            global.activeSockets = global.activeSockets.filter(soc => soc !== socket.id);
            //console.log('socket disconnected.');
        });
    
        socket.on("register-home", (data) =>
        {
            console.log(data);
            if (!common.validateToken(data.token))
                return;

            mysqlCon.getConnection(function(err, connection)
            {
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
                            socket.emit("ok-register-home", {
                                sha: sha
                            });        
                        }

                        connection.release();
                    });
                });

            });
        });

        socket.on("register-user", (data) =>
        {
            if (!common.validateToken(data.token))
                return;

            mysqlCon.getConnection(function(err, connection){
                if (err) throw err;
                connection.query("select id from patroleum.homes where sha='" + data.address + "'", function(err, result)
                {
                    if (err)
                    {
                        socket.emit("server-error", {
                            error: err.message
                        });
                        return;
                    }

                    if (result.length == 0)
                    {
                        socket.emit("server-error", {
                            error: "There is no the current Home Address!"
                        });
                        return;
                    }

                    connection.query("insert into patroleum.users(firstname, lastname, email, phonenumber, dispname, password, gender, home_id, role) values('" + 
                                            data.firstname + "', '" + data.lastname + "', '" + data.email + "', '" + data.phonenumber + "', '" +
                                            data.dispname + "', '" + data.password + "', '" + data.gender + "', " + result[0].id + ", 'client')", function(err, result)
                    {
                        if (err)
                        {
                            //throw err;
                            socket.emit("fail-register-user", {
                                error: err.message
                            });
                        }
                        else
                        {
                            socket.emit("ok-register-user");        
                        }

                        connection.release();
                    });
                });
            });
        });

        
        socket.on("register-camera", (data) =>
        {
            if (!common.validateToken(data.token))
                return;

            mysqlCon.getConnection(function(err, connection){
                if (err) throw err;
                connection.query("select id from patroleum.homes where sha='" + data.address + "'", function(err, result)
                {
                    if (err)
                    {
                        socket.emit("server-error", {
                            error: err.message
                        });
                        return;
                    }

                    if (result.length == 0)
                    {
                        socket.emit("server-error", {
                            error: "There is no the current Home Address!"
                        });
                        return;
                    }

                    connection.query("insert into patroleum.users(url, dispname, location, home_id) values('" + 
                                            data.uri + "', '" + data.dispname + "', '" + data.location + "', " + result[0].id + ")", function(err, result)
                    {
                        if (err)
                        {
                            //throw err;
                            socket.emit("fail-register-camera", {
                                error: err.message
                            });
                        }
                        else
                        {
                            socket.emit("ok-register-camera");        
                        }
                        connection.release();
                    });
                });
            });
        });

        socket.on("get-all-home-data", (data) =>
        {
            if (!common.validateToken(data.token))
                return;

            mysqlCon.getConnection(function(err, connection){
                if (err) throw err;
                connection.query("select * from patroleum.homes", function(err, result)
                {
                    if (err)
                    {
                        socket.emit("server-error", {
                            error: err.message
                        });
                        return;
                    }

                    if (result.length == 0)
                    {
                        socket.emit("server-error", {
                            error: "There is no the Home Address Info!"
                        });
                        return;
                    }

                    var alldata = [];
                    for (var i = 0; i < result.length; i++)
                    {
                        alldata.push({
                            address1: result[i].address1,
                            address2: result[i].address2,
                            city: result[i].city,
                            state: result[i].state,
                            poscode: result[i].postcode,
                            country: result[i].country,
                            sha: result[i].sha
                        });
                    }

                    socket.emit("all-home-data", alldata);

                    connection.release();
                });
            });
        });

        socket.on('test-connection', (data) =>
        {
            if (!common.validateToken(data.token))
            {
                return;
            }
            console.log('test-connection ', data.uri);

            var websocket_port = common.getAvailablePort();
            var socServer = stream.getSocketServer(websocket_port);

            var stream_port = common.getAvailablePort();
            var streamServer = stream.getStreamServer(socServer, data.token, stream_port);

            var ffmpeg = stream.createStream(data.uri, data.token, stream_port);

            global.activeStreams[data.token] = JSON.stringify({
                socketServer: socServer,
                streamServer: streamServer,
                websocketPort: websocket_port,
                streamPort: stream_port,
                streamFFmpeg: ffmpeg
            });

            socket.emit("start-streaming", {
                port: websocket_port
            })
        });

        socket.on('test-disconnection', ({token}) =>
        {
            if (!common.validateToken(token))
            {
                return;
            }
            
            var info = JSON.parse(global.activeStreams[token]);
            try
            {
                info.streamServer.close();
                info.socketServer.close();

                stream.killStream(info.streamFFmpeg);
            }
            catch(e)
            {
                console.log(e);
            }

            common.removePort(info.websocketPort);
            common.removePort(info.streamPort);

            delete global.activeStreams[token];
        })
    });

    return io;
}