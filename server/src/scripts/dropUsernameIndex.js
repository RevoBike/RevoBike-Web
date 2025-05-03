const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function dropUsernameIndex() {
  try {
    // Get MongoDB connection string from .env file
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

    // List indexes before dropping
    const indexesBefore = await collection.indexes();
    console.log('Indexes before dropping:', indexesBefore);

    // Drop the username index
    await collection.dropIndex('username_1');
    console.log('Dropped index: username_1');

    // List indexes after dropping
    const indexesAfter = await collection.indexes();
    console.log('Indexes after dropping:', indexesAfter);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error dropping index:', error.message);
    process.exit(1);
  }
}

dropUsernameIndex();
