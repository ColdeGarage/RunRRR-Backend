var mysql = require('mysql');
var path = require('path');
var ROOT_PATH = path.resolve(process.env.NODE_PATH)
if (process.env.NODE_ENV === 'production'){
    var config = require(path.join(ROOT_PATH, 'src/config_production.json'));
} else if (process.env.NODE_ENV === 'test') {
    var config = require(path.join(ROOT_PATH, 'src/config_staging.json'));
} else {
    throw 'Environment setting error! Please set NODE_ENV Environment variable';
}

exports.conn = function connectionHandler(){

    var connection = mysql.createConnection(config.database);

    connection.connect(function(err){
        if(err){
            console.log("[ERROR]\tError when connecting to db:", err);
            setTimeout(connectionHandler, 2000);
                // Set a time out for reconnecting when a connection error happening to avoid hot loop.
        }
        else{
            console.log("[INFO] Success when connecting to db");
        }
    });

    return connection;
}

// TODO
// Close the connection after query job is finished. Though, need to detect asynch query is finished or not.

// USAGE
// var db = require('./db.js');
// var connection = db.conn();
// connection.query('SELECT 1 + 1 AS solution',function(error, rows, fields){
//    console.log(rows[0].solution);
// });