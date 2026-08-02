import bcrypt from "bcryptjs";

/** Hash a PIN (4–6 digits) for storage in profiles.pin_hash. */
export async function hashPin(pin: string): Promise<string> {
  return bcrypt.hash(pin, 10);
}

/** Verify a PIN attempt against the stored hash from profiles.pin_hash. */
export async function verifyPin(pin: string, pinHash: string): Promise<boolean> {
  return bcrypt.compare(pin, pinHash);
}
