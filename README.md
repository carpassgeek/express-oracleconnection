# express-oracleconnection
This is a copy of https://github.com/pwalczyszyn/express-myconnection slightly modified to work with Oracle.  @pwalczyszyn did all the real work, I just substituted Oracle for MySQL.

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

The package has been published to npmjs and can be installed via : 
  npm install express-oracleconnection
