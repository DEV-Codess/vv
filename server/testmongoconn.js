const { MongoClient } = require("mongodb");

const uri = "mongodb://vayavach_user:devshree%400901@62.72.58.40:27017/vayavach?authSource=vayavach";

async function connect() {
    try {
        console.log("Connecting to MongoDB...");
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log("Connected successfully!");
        await client.close();
    } catch (error) {
        console.error("Connection failed:", error.message);
    }
}

connect();
