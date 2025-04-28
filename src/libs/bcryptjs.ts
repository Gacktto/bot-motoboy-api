import bcrypt from "bcryptjs";

const saltRounds = 10;

/**
 * Hashes the provided password using bcrypt with the configured salt rounds.
 *
 * @param password - The plaintext password to be hashed.
 * @returns A Promise that resolves to the hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Compares a plaintext password with a hashed password using bcrypt.
 *
 * @param password - The plaintext password to be compared.
 * @param hashedPassword - The hashed password to compare against.
 * @returns A Promise that resolves to a boolean indicating whether the passwords match.
 */
export async function comparePassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}
