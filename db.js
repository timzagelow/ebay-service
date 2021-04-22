const mongoose = require('mongoose');

process.on("uncaughtException", (err) => {
    console.log("process error", err);
    process.exit(1)
});

module.exports = class Database {
    static db = null;

    static async load() {
        if (!Database.db) {
            try {
                Database.db = await mongoose.connect(process.env.MONGO_CONNECTION_STRING,
                    { replicaSet: 'rs', useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true, autoReconnect: false });
            } catch (err) {
                console.error(err);
                process.exit(1);
            }
        }

        return Database.db;
    }
};