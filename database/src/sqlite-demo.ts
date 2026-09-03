import Database from "better-sqlite3";

export const DESCRIPTION = "Learn SQL with SQLite: create, insert, and query.";

export function run(): void {
  console.log("SQLite");
  const db = new Database(":memory:");
  db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `);
  const insert = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
  insert.run("Alice", "alice@example.com");
  insert.run("Bob", "bob@example.com");
  const rows = db.prepare("SELECT * FROM users").all() as { id: number; name: string; email: string }[];
  for (const row of rows) {
    console.log(`- user: ${row.id} ${row.name} <${row.email}>`);
  }
  db.close();
}