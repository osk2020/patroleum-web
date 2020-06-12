const mysql = require('mysql');

module.exports.getDBConnection = function(config)
{
    var pool = mysql.createPool({
        host: config.get("db").host,
        user: config.get("db").user,
        password: config.get("db").password,
        port: config.get("db").port
    });

    pool.query('Select 1 + 1 As solution', function(err, results, fields)
    {
        if (err) throw err;
        console.log('The solution is: ', results[0].solution);

        createDatabaseAndTable(pool);
    });

    pool.on("acquire", function(connection)
    {
        console.log('Connection %d acquired', connection.threadId);
    });

    pool.on('connection', function (connection) {
        connection.query('SET SESSION auto_increment_increment=1')
     });

    pool.on('enqueue', function () {
        console.log('Waiting for available connection slot');
     });

    pool.on('release', function (connection) {
        console.log('Connection %d released', connection.threadId);
    });

    return pool;
};

function createDatabaseAndTable(pool)
{
    pool.query("CREATE DATABASE patroleum CHARACTER SET utf8", function (err, result) 
    {
        if (err) 
        {
            if (err.code !== "ER_DB_CREATE_EXISTS")
            {
                console.log(err.message);
                throw err;
            }
        }
        else
            console.log("Database Created!");
    
        pool.query("CREATE TABLE patroleum.users(`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `email` varchar(128) not null, `name` varchar(128) not null, `password` varchar(128) not null, `address` varchar(256) not null)", function(err, result)
        {
            if (err)
            {
                if (err.code !== "ER_TABLE_EXISTS_ERROR")
                {
                    console.log(err.message);
                    throw err;
                }
            }
            else 
                console.log("Users Table Created!");
        });

        pool.query("USE patroleum");
    });

    pool.query("USE patroleum");  
 }
