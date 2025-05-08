const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function cleanNullUsernames() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Find documents with null or missing username field
    const docs = await collection.find({ $or: [ { username: null }, { username: { $exists: false } } ] }).toArray();

    console.log(`Found ${docs.length} documents with null or missing username.`);

    if (docs.length === 0) {
      console.log('No documents to clean.');
      await mongoose.disconnect();
      return;
    }

    // Option 1: Remove the username field from these documents (if it exists)
    // Option 2: Set a unique placeholder username (e.g., "user_<id>") to avoid duplicates
    // Here, we will remove the username field if it exists

    for (const doc of docs) {
      await collection.updateOne(
        { _id: doc._id },
        { $unset: { username: "" } }
      );
      console.log(`Cleaned document with _id: ${doc._id}`);
    }

    console.log('Cleaning completed.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error cleaning null usernames:', error.message);
    process.exit(1);
  }
}

cleanNullUsernames();
