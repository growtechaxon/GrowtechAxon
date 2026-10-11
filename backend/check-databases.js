require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const name of ['growtechaxon_exam', 'growtechaxon', 'test']) {
    const db = mongoose.connection.useDb(name);
    const collections = await db.db.listCollections().toArray();
    console.log('\nDatabase:', name);
    console.log('Collections:', collections.map(c => c.name).join(', '));
  }

  await mongoose.disconnect();
})().catch(async e => {
  console.error(e.message);
  if (mongoose.connection.readyState) await mongoose.disconnect();
  process.exitCode = 1;
});
