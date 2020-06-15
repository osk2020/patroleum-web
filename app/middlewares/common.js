var hash = require('crypto');

module.exports.validateToken = function(token)
{
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