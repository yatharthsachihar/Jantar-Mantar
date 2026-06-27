// ONE-TIME REPAIR — fixes a database whose ObjectId/Date values were turned
// into plain strings by a JSON round-trip (the old dbRestore.js used plain
// JSON, which has no BSON types). Converts:
//   - every `_id` (incl. embedded subdoc _ids) from 24-hex string → ObjectId
//   - known reference fields (category, product, variationId, adminId, and the
//     array refs applicableProducts/applicableCategories/wishlist) → ObjectId
//   - date-ish fields (name ends in "At", or known date names) from ISO
//     string → Date
//
// Safe: writes each repaired collection to a temp collection, verifies the
// count, then drops the original and renames the temp into place. A failure
// mid-run leaves the original collection untouched.
//
// Usage: node scripts/repairObjectIds.js
require('dotenv').config();
const mongoose = require('mongoose');
const { ObjectId } = require('bson');

const ID_FIELDS = new Set(['_id', 'product', 'variationId', 'category', 'adminId']);
const ARRAY_ID_FIELDS = new Set(['applicableProducts', 'applicableCategories', 'wishlist']);

const isHex24 = (s) => typeof s === 'string' && /^[0-9a-fA-F]{24}$/.test(s);
const isISO   = (s) => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);
const isDateField = (k) => /At$/.test(k) || ['date', 'expiresAt', 'dob', 'lastLogin'].includes(k);

function convert(key, value) {
  if (Array.isArray(value)) {
    if (ARRAY_ID_FIELDS.has(key)) {
      return value.map((v) => (isHex24(v) ? new ObjectId(v) : convert(null, v)));
    }
    return value.map((v) => convert(null, v));
  }
  // Leave BSON types / Dates / Buffers untouched
  if (value && typeof value === 'object'
      && !(value instanceof Date)
      && value._bsontype === undefined
      && !Buffer.isBuffer(value)) {
    const out = {};
    for (const k of Object.keys(value)) out[k] = convert(k, value[k]);
    return out;
  }
  if (typeof value === 'string') {
    if (key && ID_FIELDS.has(key) && isHex24(value)) return new ObjectId(value);
    if (key && isDateField(key) && isISO(value)) return new Date(value);
  }
  return value;
}

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  console.log(`Repairing database: ${db.databaseName}\n`);

  const collections = await db.listCollections().toArray();
  for (const { name } of collections) {
    if (name.endsWith('_repair_tmp')) continue; // skip leftovers
    const coll = db.collection(name);
    const docs = await coll.find({}).toArray();
    if (docs.length === 0) { console.log(`  ${name}: empty, skipped`); continue; }

    // Only repair if at least one _id is currently a string (i.e. corrupted).
    const corrupted = docs.some((d) => typeof d._id === 'string');
    if (!corrupted) { console.log(`  ${name}: already healthy (${docs.length} docs), skipped`); continue; }

    const repaired = docs.map((d) => convert(null, d));
    const tmpName = `${name}_repair_tmp`;
    await db.collection(tmpName).drop().catch(() => {});
    await db.collection(tmpName).insertMany(repaired, { ordered: true });

    const tmpCount = await db.collection(tmpName).countDocuments();
    if (tmpCount !== docs.length) {
      throw new Error(`${name}: count mismatch (orig ${docs.length}, tmp ${tmpCount}) — aborting, original left intact`);
    }

    await coll.drop();
    await db.collection(tmpName).rename(name);
    console.log(`  ${name}: repaired ${docs.length} docs`);
  }

  console.log('\nRepair complete.');
  await mongoose.disconnect();
}

main().catch((err) => { console.error('Repair failed:', err.message); process.exit(1); });
