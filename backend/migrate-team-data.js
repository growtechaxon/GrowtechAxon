require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const source = mongoose.connection.useDb('test').collection('teams');
  const target = mongoose.connection.useDb('growtechaxon_exam').collection('teams');

  const members = await source.find({}).toArray();
  const existingCount = await target.countDocuments();

  console.log('Source members:', members.length);
  console.log('Existing target members:', existingCount);

  if (members.length === 0) {
    throw new Error('Source collection is empty. Nothing copied.');
  }

  if (existingCount !== 0) {
    throw new Error(
      'Target collection is not empty. Migration stopped to avoid overwriting or duplicating data.'
    );
  }

  await target.insertMany(members);

  console.log('Migration complete. Members copied:', members.length);
  console.log(
    'Target verification:',
    await target.find({}, { projection: { name: 1, designation: 1, photo: 1 } }).toArray()
  );

  await mongoose.disconnect();
})().catch(async error => {
  console.error('Migration stopped:', error.message);
  if (mongoose.connection.readyState) await mongoose.disconnect();
  process.exitCode = 1;
});
