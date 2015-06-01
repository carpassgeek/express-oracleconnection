# express-oracleconnection
This is a copy of https://github.com/pwalczyszyn/express-myconnection slightly modified to work with Oracle.  @pwalczyszyn did all the real work, I just substituted Oracle for MySQL.

Initialization is done the same way as express-myconnection but only 'single' and 'pool' strategies are supported (pool is strongly recommended).
  // app.js
  ...
  var oracledb = require('oracledb'),
    myConnection = require('express-myconnection'), // express-myconnection module
    dbOptions = {
      host: 'localhost',
      user: 'dbuser',
      password: 'password',
      port: 3306,
      database: 'mydb'
    };

  app.use(myConnection(mysql, dbOptions, 'single');
  ...

The package has been published to npmjs and can be installed via : 
  npm install express-oracleconnection
