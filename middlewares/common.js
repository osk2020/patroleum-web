var hash = require('crypto');

const BASE_PORT = 11210;

module.exports.updateToken = function(token)
{
    if (global.activeUsers[token] !== null)
    {
        global.activeUsers[token].date = Math.floor(Date.now() / 1000);
    }
}

module.exports.validateToken = function(token)
{
    console.log("validateToken ", global.activeUsers);
    if (global.activeUsers[token] == null)
    {
        return false;
    }

    this.updateToken(token);

    return true;
}

module.exports.getAvailablePort = function()
{
    for (var i = 0; i < 1000; i++)
    {
        var ports = global.activePorts.filter(p => p == (BASE_PORT + i));
        console.log("getAvailablePort ", ports);
        if (ports.length == 0)
        {
            global.activePorts.push(BASE_PORT + i);
            return BASE_PORT + i;
        }
    }

    return 0;
}

module.exports.removePort = function(port)
{
    global.activePorts = global.activePorts.filter(p => p !== port);
}

module.exports.getHashString = function(data)
{
    return hash.createHash("sha1").update(JSON.stringify(data), "binary").digest("hex");
}

module.exports.convertObjectToString = function(object)
{
    var str = '';
    for (var p in object)
    {
        if (object.hasOwnProperty(p))
        {
            str += object[p];
        }
    }

    return str;
}