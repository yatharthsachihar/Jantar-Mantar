// Restores a JSON backup produced by dbBackup.js. DESTRUCTIVE — overwrites
// every collection present in the backup file with its backed-up contents.
// Requires an explicit file path and CONFIRM_RESTORE=true so it can never be
// run by accident (e.g. a stray "npm run db:restore" with no args).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// Parse with EJSON so {$oid}/{$date} typed values come back as real ObjectId
// and Date instances. Plain JSON.parse would leave them as strings and
// corrupt every _id / reference in the database.
const { EJSON } = require('bson');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set — refusing to restore. Check your .env.');
  process.exit(1);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('Usage: CONFIRM_RESTORE=true node scripts/dbRestore.js <path-to-backup.json>');
  process.exit(1);
}

if (process.env.CONFIRM_RESTORE !== 'true') {
  console.error('Refusing to restore: this overwrites live data. Re-run with CONFIRM_RESTORE=true to proceed.');
  process.exit(1);
}

const resolvedPath = path.resolve(filePath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Backup file not found: ${resolvedPath}`);
  process.exit(1);
}

async function main() {
  // relaxed:false matches the canonical EJSON the backup writes; EJSON.parse
  // also reads relaxed/plain JSON fine, so older backups still load.
  const dump = EJSON.parse(fs.readFileSync(resolvedPath, 'utf8'), { relaxed: false });

  const dbNameMatch = MONGO_URI.match(/\/([^/?]+)(\?|$)/);
  const targetDb = dbNameMatch ? dbNameMatch[1] : '(name unknown)';
  console.log(`Restoring into database: ${targetDb}`);
  console.log(`Backup taken at: ${dump._meta?.takenAt || 'unknown'}`);
  console.log('This will REPLACE the contents of every collection in the backup file.\n');

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  for (const [name, docs] of Object.entries(dump)) {
    if (name === '_meta' || !Array.isArray(docs)) continue;
    const coll = db.collection(name);
    await coll.deleteMany({});
    if (docs.length) await coll.insertMany(docs);
    console.log(`  ${name}: restored ${docs.length} document(s)`);
  }

  console.log('\nRestore complete.');
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Restore failed:', err.message);
  process.exit(1);
});
