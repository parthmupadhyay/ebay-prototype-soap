var ejs= require('ejs');
var mysql = require('mysql');

var connectionPool  = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'ebaydb',
    port     : '3306',
    connectionLimit:500,
    queueLimit:50
});


/*
 function getConnection(){
 var connection = mysql.createConnection({
 host     : 'localhost',
 user     : 'root',
 password : 'root',
 database : 'ebaydb',
 port	 : 3306
 });
 return connection;
 }*/


//self implemented connection pool
/*var pool = [];
 var count = 0;
 var queue = [];
 var queueasMap = new Map();
 var pSize = 200;
 var qSize = 100;
 function CreateConnectionPool() {

 for (var i = 0; i < pSize; i++) {
 var connection = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'root',
 database: 'ebaydb'
 });
 pool.push(connection);

 }
 }

 function getConnection(callback) {

 console.log("connection is requested");

 if (isConnectionFree()) {

 console.log("connection is free");
 callback(pool.pop());

 } else {

 console.log("connection is not free");
 if (isQueueFree()) {

 console.log('in the queue');
 queue.push(count);
 queueasMap.set(count, false);
 var temp = count;
 count++;


 } else {

 console.log('connection is refused');
 return null;
 }
 }
 }


 function releaseConnection(connection) {

 pool.push(connection);
 console.log('connection is released');
 queueasMap.set(queue.pop(), true);
 queue.shift();

 }

 function isConnectionFree() {

 if (pool.length <= 0)
 return false;
 else
 return true;

 }

 function isQueueFree() {

 if (queue.length >= qSize)
 return false;
 else
 return true;
 }
 */





/*exports.execute=function(callback,sqlQuery)
 {
 console.log("\nSQL Query::"+sqlQuery);

 var connection=getConnection();

 connection.query(sqlQuery, function(err, rows, fields) {
 if(err){
 console.log("ERROR: " + err.message);
 }
 else
 {	// return err or result
 console.log("DB Results:"+rows);
 callback(err, rows);
 }
 });
 console.log("\nConnection closed..");
 connection.end();

 }*/


exports.execute=function(callback,sqlQuery)
{
    console.log("\nSQL Query::"+sqlQuery);

    connectionPool.getConnection(function (err,connection)
    {
        if(err)
        {
            throw err;
        }
        else
        {
            connection.query(sqlQuery, function(error, result) {
                if(error){
                    console.log("ERROR: " + error.message);
                }
                else
                {	// return err or result
                    console.log("DB Results:"+result);
                    callback(err, result);
                }
            });
            connection.release();
        }
    });

}

exports.connectionPool=connectionPool;
