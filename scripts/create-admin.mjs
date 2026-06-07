/**
 * One-time script to create or promote an admin user.
 *
 * Usage:
 *   node scripts/create-admin.mjs
 *   node scripts/create-admin.mjs --email you@example.com --password YourPass123 --firstName Admin --lastName User
 *
 * If the email already exists as a regular user, their role is upgraded to admin
 * and the password is updated.
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'fs';
import { resolve } from 'path';

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const idx = trimmed.indexOf('=');
      if (idx === -1) continue;
      const key = trimmed.slice(0, idx).trim();
      let val = trimmed.slice(idx + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.warn('Could not read .env file — using existing environment variables.');
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  const result = {};

  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace(/^--/, '');
    const value = args[i + 1];
    if (key && value) result[key] = value;
  }

  return result;
}

function prompt(question) {
  return new Promise((resolvePrompt) => {
    process.stdout.write(question);
    process.stdin.once('data', (data) => resolvePrompt(data.toString().trim()));
  });
}

loadEnv();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Add it to your .env file.');
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    loginType: { type: String, enum: ['direct', 'social'], default: 'direct' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function main() {
  const cli = parseArgs();

  let email = cli.email;
  let password = cli.password;
  let firstName = cli.firstName;
  let lastName = cli.lastName;

  if (!email) email = await prompt('Admin email: ');
  if (!password) password = await prompt('Admin password (min 6 chars): ');
  if (!firstName) firstName = await prompt('First name [Admin]: ') || 'Admin';
  if (!lastName) lastName = await prompt('Last name [User]: ') || 'User';

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    console.error('A valid email is required.');
    process.exit(1);
  }

  if (!password || password.length < 6) {
    console.error('Password must be at least 6 characters.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();
  const hashedPassword = await bcrypt.hash(password, 10);

  await mongoose.connect(MONGO_URI);

  const existing = await User.findOne({ email: normalizedEmail });

  if (existing) {
    existing.role = 'admin';
    existing.loginType = 'direct';
    existing.password = hashedPassword;
    existing.isVerified = true;
    if (!existing.firstName) existing.firstName = firstName;
    if (!existing.lastName) existing.lastName = lastName;
    await existing.save({ validateBeforeSave: false });
    console.log(`\nUpdated existing user to admin: ${normalizedEmail}`);
  } else {
    await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      password: hashedPassword,
      loginType: 'direct',
      isVerified: true,
      role: 'admin',
    });
    console.log(`\nCreated new admin user: ${normalizedEmail}`);
  }

  console.log('You can now log in at /admin with this email and password.\n');
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
