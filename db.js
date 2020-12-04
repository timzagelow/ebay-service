const mongoose = require('mongoose');

module.exports = class Database {
    static db = null;

    static async load() {
        if (!Database.db) {
            try {
                Database.db = await mongoose.connect(process.env.MONGO_CONNECTION_STRING,
                    { replicaSet: 'rs', useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });
            } catch (err) {
                console.error(err);
            }
        }

        return Database.db;
    }
};