// MongoDB is not currently used in this project.
// This file is kept as a placeholder in case MongoDB integration is needed in the future.
// To prevent crashes when MONGODB_URI is not set, no error is thrown.

let clientPromise = null;

if (process.env.MONGODB_URI) {
    const { MongoClient } = require('mongodb');
    const uri = process.env.MONGODB_URI;
    const options = {};

    let client;

    if (process.env.NODE_ENV === 'development') {
        if (!global._mongoClientPromise) {
            client = new MongoClient(uri, options);
            global._mongoClientPromise = client.connect();
        }
        clientPromise = global._mongoClientPromise;
    } else {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
    }
} else {
    console.warn('[MongoDB] MONGODB_URI is not set. MongoDB features are disabled.');
}

export default clientPromise;
