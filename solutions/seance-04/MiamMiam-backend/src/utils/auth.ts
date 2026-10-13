import jwt from "jsonwebtoken";
import { TokenPayload } from "../models/auth.model";

const SECRET_KEY = process.env.JWT_SECRET!;

export function generateToken(user: TokenPayload): string {
  return jwt.sign(user, SECRET_KEY, {
    expiresIn: "1d",
    algorithm: "HS256",
  });
}

export function verifyToken(token: string): TokenPayload | undefined {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error("Token invalide", error);
    return undefined;
  }
}
