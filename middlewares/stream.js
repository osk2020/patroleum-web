var webSocket = require('ws');
var fs = require('fs');
var http = require('http');

const { spawn } = require('child_process');

module.exports.getSocketServer = function(port)
{
    var socketServer = new webSocket.Server({port: port, perMessageDeflate: false});
    socketServer.connectionCount = 0;
    socketServer.on('connection', function(socket, upgradeReq)
    {
        socketServer.connectionCount++;
        console.log(
            'New WebSocket Connection: ',
            (upgradeReq || socket.upgradeReq).socket.remoteAddress,
            (upgradeReq || socket.upgradeReq).headers['user-agent'],
            '('+socketServer.connectionCount+' total)'
        );

        socket.on('close', function(code, message){
            socketServer.connectionCount--;
            console.log(
                'Disconnected WebSocket ('+socketServer.connectionCount+' total)'
            );
        });
    });

    socketServer.broadcast = function(data) {
        socketServer.clients.forEach(function each(client) {
            if (client.readyState === webSocket.OPEN) {
                client.send(data);
            }
        });
    };

    console.log('Awaiting WebSocket connections on ws://127.0.0.1:' + port + '/');

    return socketServer;
};

module.exports.getStreamServer = function(socketServer, token, port)
{
    var streamServer = http.createServer( function(request, response) {
        var params = request.url.substr(1).split('/');
        console.log("getStreamServer ", params);

        if (params[0] !== token) {
            console.log(
                'Failed Stream Connection: '+ request.socket.remoteAddress + ':' +
                request.socket.remotePort + ' - wrong secret.'
            );
            response.end();
        }
    
        response.connection.setTimeout(0);
        console.log(
            'Stream Connected: ' +
            request.socket.remoteAddress + ':' +
            request.socket.remotePort
        );
        request.on('data', function(data){
            socketServer.broadcast(data);
        });
        request.on('end',function(){
            console.log('close');
        });
    });

    streamServer.headersTimeout = 0;
    streamServer.listen(port);

    console.log('Listening for incomming MPEG-TS Stream on http://127.0.0.1:' + port + '/<secret>');

    return streamServer;
}

module.exports.createStream = function(uri, token, port)
{    
    //const filePath = require.resolve("../bin/ffmpeg.exe"); // for Windows
    const filePath = "ffmpeg"; // for Linux
    console.log(filePath);
    const ffmpeg = spawn(filePath, ['-re -i ' + uri, '-maxrate 20M -bufsize 10M -f mpegts', '-codec:v mpeg1video', '-r 25 -b:v 1000k', '-bf 0', 'http://127.0.0.1:' + port + '/' + token], { shell:true });
    //const ffmpeg = spawn(filePath, ['-re -i https://www.radiantmediaplayer.com/media/bbb-360p.mp4', '-maxrate 20M -bufsize 10M -f mpegts', '-codec:v mpeg1video', '-r 25 -b:v 1000k', '-bf 0', 'http://127.0.0.1:' + port + '/' + token], { shell:true });
    //const ffmpeg = spawn(filePath, ['-f dshow', '-i video="USB2.0 PC CAMERA"', '-f mpegts', '-codec:v mpeg1video', '-s 640x480', '-b:v 100k', '-bf 0', 'http://127.0.0.1:' + port + '/' + token], { shell:true }); 
    
    /*
    ffmpeg.stderr.on('data', (data) =>
    {
        console.error(`${data}`);
    });
    */

    ffmpeg.on('close', (code) =>
    {
        console.log(`child process exited with code ${code}`);
    });

    return ffmpeg;
}

module.exports.killStream = function(stream)
{
    spawn('taskkill', ["/pid", stream.pid, "/f", "/t"]);
}
