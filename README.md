# express-oracleconnection
This is a copy of [express-myconnection](https://github.com/pwalczyszyn/express-myconnection) slightly modified to work with Oracle.  [pwalczyszyn](https://github.com/pwalczyszyn/) did all the real work, I just substituted Oracle for MySQL.

###Usage
Initialization is done the same way as express-myconnection but only 'single' and 'pool' strategies are supported (pool is strongly recommended).

    // app.js
    ...
    var oracledb = require('oracledb'),
        oracleConnection = require('express-oracleconnection'), 
        dbOptions = {
            host: 'localhost/XE',
            user: 'schema',
            password: 'password'
        };
    app.use(oracleConnection(oracledb, dbOptions, 'pool');
    ...

In the same manner as [express-myconnection](https://github.com/pwalczyszyn/express-myconnection), it extends the request and provides a getOracleConnection() method.

    //route.js
    ...
    module.exports = function(req, res, next) {
        ...
        req.getOracleConnection(function(err, conn) {
          if (err) return next(err);
          
          connection.query('select sysdate from dual', function(err, result) {
            if (err) return next(err);
            
            console.log(result.rows);
          });
          
        });
        ...
    }
    ...

The package has been published to npmjs and can be installed via : 

    npm install express-oracleconnection
