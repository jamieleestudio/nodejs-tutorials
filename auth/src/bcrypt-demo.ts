import bcrypt from "bcryptjs";

export const DESCRIPTION = "Learn password hashing and verification with bcrypt.";

export function run(): void {
  console.log("Bcrypt");
  const password = "s3cr3t";
  const hash = bcrypt.hashSync(password, 10);
  console.log(`- hash: ${hash.slice(0, 20)}...`);
  console.log(`- verify (correct): ${bcrypt.compareSync(password, hash)}`);
  console.log(`- verify (wrong): ${bcrypt.compareSync("wrong", hash)}`);
}