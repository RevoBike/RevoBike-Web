const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function fixNullUsernames() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(mongoUri, {
      tls: true,
      tlsAllowInvalidCertificates: true,
    });

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // Find documents with null or missing username field
    const docs = await collection.find({ $or: [ { username: null }, { username: { $exists: false } } ] }).toArray();

    console.log(`Found ${docs.length} documents with null or missing username.`);

    if (docs.length === 0) {
      console.log('No documents to update.');
      await mongoose.disconnect();
      return;
    }

    // Update documents by setting a unique placeholder username (e.g., "user_<id>")
    for (const doc of docs) {
      const newUsername = `user_${doc._id.toString()}`;
      await collection.updateOne(
        { _id: doc._id },
        { $set: { username: newUsername } }
      );
      console.log(`Updated document _id: ${doc._id} with username: ${newUsername}`);
    }

    console.log('Update completed.');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error updating null usernames:', error.message);
    process.exit(1);
  }
}

fixNullUsernames();
