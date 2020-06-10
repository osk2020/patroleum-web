const https = require('https');
const http = require('http');
const app = require('./app');
const fs = require('fs');
const config = require('config');

const   httpport = process.env.PORT || config.get('host').httpport || 1210,
        httpsport = process.env.SECURE_PORT || config.get('host').httpsport || 1280;

http.createServer(app).listen(httpport, function(err) {
    if (err) {
        throw err
    }

    console.log('Insecure server is listening on port ' + httpport + "...");
});
