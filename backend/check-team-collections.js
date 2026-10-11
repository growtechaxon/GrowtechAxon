require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const dbName of ['growtechaxon_exam', 'growtechaxon', 'test']) {
    const db = mongoose.connection.useDb(dbName);

    for (const collectionName of ['teams', 'teammembers']) {
      const exists = await db.db.listCollections({ name: collectionName }).hasNext();
      if (!exists) continue;

      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      const records = await collection.find({})
        .project({ name: 1, designation: 1, photo: 1, active: 1, isFounder: 1 })
        .limit(10)
        .toArray();

      console.log('\nDatabase:', dbName, '| Collection:', collectionName);
      console.log('Count:', count);
      console.log(JSON.stringify(records, null, 2));
    }
  }

  await mongoose.disconnect();
})().catch(async error => {
  console.error(error);
  if (mongoose.connection.readyState) await mongoose.disconnect();
  process.exitCode = 1;
});
