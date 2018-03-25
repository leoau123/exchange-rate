var config = {
    port: 3000,
    logPath: "log/app-test.log",
    cert: "config/cert/server.crt",
    key: "config/cert/server.key",
    mongo: {
        url: "mongodb://localhost/currency",
        option: {
            autoIndex: false,
            reconnectTries: 20,
            reconnectInterval: 500,
            poolSize: 10,
            bufferMaxEntries: 0,
            checkServerIdentity: false,
            keepAlive: 30000,
            connectTimeoutMS: 3000,
            socketTimeoutMS: 360000,
            authSource: "admin",
            auth: {
                user: "admin",
                password: "admin"
            }
        }
    }
};

module.exports = config;