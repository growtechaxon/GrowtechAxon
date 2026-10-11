require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./MODELS/Team');

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  console.log('Database name:', mongoose.connection.name);
  console.log('Total Team records:', await Team.countDocuments());
  console.log(
    'Active Team records:',
    await Team.countDocuments({
      $or: [{ active: true }, { active: { $exists: false } }]
    })
  );
  console.log(
    'Team members:',
    JSON.stringify(await Team.find({}, 'name active photo').lean(), null, 2)
  );

  await mongoose.disconnect();
})().catch(async (err) => {
  console.error('Diagnostic error:', err.message);
  if (mongoose.connection.readyState) await mongoose.disconnect();
  process.exitCode = 1;
});
