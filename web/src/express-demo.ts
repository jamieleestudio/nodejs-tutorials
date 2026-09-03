import express from "express";

export const DESCRIPTION = "Learn Express basics: routing and middleware.";

export async function run(): Promise<void> {
  console.log("Express");
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ message: "Hello from Express!" });
  });

  app.get("/users/:id", (req, res) => {
    res.json({ id: req.params.id });
  });

  const server = app.listen(0);
  const port = (server.address() as { port: number }).port;
  console.log(`- express listening on port ${port}`);

  const rootRes = await fetch(`http://127.0.0.1:${port}/`);
  console.log(`- GET /: ${JSON.stringify(await rootRes.json())}`);

  const userRes = await fetch(`http://127.0.0.1:${port}/users/42`);
  console.log(`- GET /users/42: ${JSON.stringify(await userRes.json())}`);

  await new Promise<void>((resolve) => server.close(() => resolve()));
}