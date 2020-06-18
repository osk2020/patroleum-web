var hash = require('crypto');

module.exports.updateToken = function(token)
{
    if (global.activeUsers[token] !== null)
    {
        global.activeUsers[token].date = Math.floor(Date.now() / 1000);
    }
}

module.exports.validateToken = function(token)
{
    console.log(token);
    console.log(global.activeUsers);
    if (global.activeUsers[token] == null)
    {
        return false;
    }

    this.updateToken(token);

    return true;
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