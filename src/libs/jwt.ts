import jwt from "jsonwebtoken";

/**
 * Generates a JSON Web Token (JWT) for the given payload.
 *
 * @param payload - The payload to be encoded in the JWT.
 * @returns A signed JWT as a string.
 *
 * @throws Will throw an error if the secret key is not defined.
 */
export function generateToken(payload: object) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY ?? "", {
    expiresIn: "2h",
  });
}

/**
 * Verifies the given JWT token using the secret key from environment variables.
 *
 * @param token - The JWT token to be verified.
 * @returns The decoded token if verification is successful.
 * @throws {Error} If the token is invalid or verification fails.
 */
export function verifyToken(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY ?? "");
  } catch (err) {
    throw new Error("Token inválido");
  }
}

/**
 * Checks if the given JWT token has expired.
 *
 * @param token - The JWT token to be checked.
 * @returns A boolean indicating whether the token has expired.
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded: any = jwt.decode(token);
    if (!decoded?.exp) {
      throw new Error("Token inválido");
    }
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (err) {
    throw new Error("Token inválido");
  }
}
