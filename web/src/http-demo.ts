import http from "node:http";

export const DESCRIPTION = "Learn the raw http module to build a server.";

export function run(): Promise<void> {
  return new Promise((resolve) => {
    console.log("HTTP");
    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`Hello from http! (${req.method} ${req.url})`);
    });
    server.listen(0, () => {
      const port = (server.address() as { port: number }).port;
      console.log(`- server listening on port ${port}`);
      fetch(`http://127.0.0.1:${port}/hello`)
        .then((r) => r.text())
        .then((body) => {
          console.log(`- response: ${body}`);
          server.close(() => resolve());
        });
    });
  });
}