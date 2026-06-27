// Dumps every collection that matters to a single timestamped JSON file under
// server/backups/. Intended for local/dev use and as a manual pre-deploy
// safety net — production should rely on MongoDB Atlas scheduled backups
// (see docs/backup-and-restore.md).
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
// EJSON (extended JSON) preserves BSON types — ObjectId, Date, etc. — across
// the file round-trip. Plain JSON.stringify would silently flatten ObjectId
// and Date into strings, which corrupts every _id and reference on restore.
const { EJSON } = require('bson');

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set — refusing to back up. Check your .env.');
  process.exit(1);
}

// Collections backed up by name (not by requiring each model, so a missing/
// renamed model file can't silently skip a collection or crash the script).
const COLLECTIONS = [
  'admins', 'users', 'orders', 'products', 'categories', 'media',
  'banners', 'blogs', 'coupons', 'enquiries', 'pages', 'settings',
  'storesettings', 'notifications', 'activitylogs',
];

const BACKUP_DIR = path.join(__dirname, '..', 'backups');

async function main() {
  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  // Never print the URI itself — it may contain a username/password.
  const dbNameMatch = MONGO_URI.match(/\/([^/?]+)(\?|$)/);
  console.log(`Connecting to database: ${dbNameMatch ? dbNameMatch[1] : '(name unknown)'}`);

  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const dump = { _meta: { takenAt: new Date().toISOString(), database: db.databaseName } };

  for (const name of COLLECTIONS) {
    try {
      const docs = await db.collection(name).find({}).toArray();
      dump[name] = docs;
      console.log(`  ${name}: ${docs.length} document(s)`);
    } catch (err) {
      console.warn(`  ${name}: skipped (${err.message})`);
    }
  }

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outFile = path.join(BACKUP_DIR, `backup-${stamp}.json`);
  // Canonical EJSON (relaxed:false) so ObjectId/Date survive as typed values.
  fs.writeFileSync(outFile, EJSON.stringify(dump, null, 2, { relaxed: false }));

  console.log(`\nBackup written to ${outFile}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error('Backup failed:', err.message);
  process.exit(1);
});
