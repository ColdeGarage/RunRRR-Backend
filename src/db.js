var mysql = require('mysql');

exports.conn = function connectionHandler(){

    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'run_for_ee'
    });

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