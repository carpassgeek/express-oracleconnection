var _oracle,
    _dbConfig,
    _connection, // This is used as a singleton in a single connection strategy
    _pool; // Pool singleton

/**
 * Handling connection disconnects, as felix did over here: https://github.com/felixge/node-mysql
 */
function handleDisconnect() {
    _oracle.getConnection(_dbConfig, function(err, connection) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }

        _connection = connection;
    });
}

/**
 * Returns middleware that will handle mysql db connections
 *
 * @param {Object} oracle - oracle module
 * @param {Object} dbConfig - object with mysql db options
 * @param {String} or undefined strategy - default is single strategy
 * @return {Function}
 * @api public
 */
module.exports = function (oracle, dbConfig, strategy) {

    if (null == oracle) throw new Error('Missing oracle module param!');
    if (null == dbConfig) throw new Error('Missing dbConfig module param!');
    if (null == strategy) strategy = 'single';

    // Setting _oracle module ref
    _oracle = oracle;

    // Setting _dbConfig ref
    _dbConfig = dbConfig;

    // Configuring strategies
    switch (strategy) {
        case 'single':
            // Creating single connection instance
            _oracle.getConnection(dbConfig, function(err, conn) {
                if(err) {
                    console.log('Error : Could not create Oracle connection');
                }
                _connection = conn;
            });
            handleDisconnect(dbConfig);
            break;

        case 'pool':
            // Creating pool instance
            _oracle.createPool(dbConfig, function(err, pool) {
                if(err) {
                    console.log('Error : Could not create Oracle connection pool');
                }
                _pool = pool;
            });
            break;
        default:
            throw new Error('Unsupported connection strategy!');
    }

    return function (req, res, next) {
        var poolConnection,
            requestConnection;

        switch (strategy) {
            case 'single':
                // getConnection will return singleton connection
                req.getOracleConnection = function (callback) {
                    callback(null, _connection);
                }
                break;

            case 'pool':
                req.getOracleConnection = function (callback) {
                    // Returning cached connection from a pool, caching is on request level
                    if (poolConnection) return callback(null, poolConnection);
                    // Getting connection from a pool
                    _pool.getConnection(function (err, connection) {
                        if (err) return callback(err);
                        poolConnection = connection;
                        callback(null, poolConnection);
                    });
                }
                break;
        }

        var end = res.endOracleConnection;

        res.endOracleConnection = function (data, encoding) {

            // Release pool connection if available
            if (poolConnection) poolConnection.release();

            res.end = end;
            res.end(data, encoding);
        }

        next();
    }
}
