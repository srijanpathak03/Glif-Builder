// mongo.js
const { MongoClient, ObjectID } = require('mongodb');
require("dotenv").config();

const uri = 'mongodb+srv://balpreet:ct8bCW7LDccrGAmQ@cluster0.2pwq0w2.mongodb.net/enayetTest'
             
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,  
  });
  let db;

async function connect() {
    try {
        await client.connect();  // Attempt to connect
        db = client.db(); // Assigns the database handle
    } catch (error) {
        console.error("Connection to MongoDB failed:", error);
        throw error; // Rethrow or handle error appropriately
    }
    return db;
}

async function getDb() {
    if (!db) {
        await connect();
    }
    return db;
}

async function getCollections() {
    const db = await getDb();
    return {
        userCollection: db.collection("user"),
        seriesCollection: db.collection("series"),
        video_schedules: db.collection("video_schedules"),
        midjourneyImageCollection: db.collection("MidjourneyImages"),
        supportTickets: db.collection("supportTickets"),
        videoCollection: db.collection("FinalVideo"),
        plansCollection: db.collection("Plans"),
        contactCollection: db.collection("contact"),
        templateCollection: db.collection("templateCollection"),
        createdVideoCollection: db.collection("createdVideoCollection"),
        templateVideoCollection: db.collection("templateVideoCollection"),
        flowsCollection: db.collection("Flows")
    };
}

// const { userCollection, seriesCollection, video_schedules, midjourneyImageCollection, videoCollection } = await getCollections()

module.exports = { connect, client, db, getCollections };


