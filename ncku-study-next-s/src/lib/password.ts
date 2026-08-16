import bcrypt from 'bcryptjs';

const BCRYPT_HASH_PATTERN = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;

function isBcryptHash(value: string): boolean {
  return BCRYPT_HASH_PATTERN.test(value);
}

export async function verifyPassword(password: string, storedPassword: string): Promise<boolean> {
  // The mock repository intentionally uses plain-text seed data. Production data
  // comes from Laravel and must always be verified as a bcrypt hash.
  if (process.env.USE_MOCK === 'true' && !isBcryptHash(storedPassword)) {
    return storedPassword === password;
  }

  if (!isBcryptHash(storedPassword)) return false;

  return bcrypt.compare(password, storedPassword);
}
