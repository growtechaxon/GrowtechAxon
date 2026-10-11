require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./MODELS/Team');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  for (const dbName of ['growtechaxon_exam', 'growtechaxon', 'test']) {
    const db = mongoose.connection.useDb(dbName);
    const TeamModel = db.models.Team || db.model('Team', Team.schema);

    const members = await TeamModel.find(
      {},
      'name active photo'
    ).lean();

    console.log('\nDatabase:', dbName);
    console.log('Records:', members.length);
    console.log('Members:', JSON.stringify(members));
  }

  await mongoose.disconnect();
})().catch(async err => {
  console.error('Diagnostic error:', err.message);
  if (mongoose.connection.readyState) await mongoose.disconnect();
  process.exitCode = 1;
});
