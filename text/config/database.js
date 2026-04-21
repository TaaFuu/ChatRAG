const mongoose = require("mongoose");
const { Pool } = require("pg");

let pgPoolInstance = null;
// MongoDB
module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongo connected");
    } catch (error) {
        console.log("Mongo connect error");
    }

};

// PostgreSQL
module.exports.connectPostgresql = async () => {
    try {
        if (!pgPoolInstance) {
            pgPoolInstance = new Pool({
                user: process.env.PG_USER,
                host: process.env.PG_HOST,
                database: process.env.PG_DB,
                password: process.env.PG_PASSWORD,
                port: process.env.PG_PORT,
            });

            await pgPoolInstance.query("SELECT NOW()");
            console.log("PostgreSQL connected");
        }
    } catch (error) {
        console.log("PostgreSQL connect error", error);
    }
};

module.exports.getPgPool = () => pgPoolInstance;