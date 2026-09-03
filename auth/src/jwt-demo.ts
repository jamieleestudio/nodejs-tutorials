import jwt from "jsonwebtoken";

export const DESCRIPTION = "Learn JWT token signing and verification.";

export function run(): void {
  console.log("JWT");
  const secret = "demo-secret";
  const token = jwt.sign({ userId: 42, role: "admin" }, secret, { expiresIn: "1h" });
  console.log(`- token: ${token.slice(0, 20)}...`);
  const payload = jwt.verify(token, secret) as { userId: number; role: string };
  console.log(`- payload: ${JSON.stringify(payload)}`);
}