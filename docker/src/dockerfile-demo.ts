export const DESCRIPTION = "Learn Dockerfile basics for Node.js apps.";

export function run(): void {
  console.log("Dockerfile");
  console.log("- FROM node:20-alpine");
  console.log("- WORKDIR /app");
  console.log("- COPY package*.json ./ && npm ci");
  console.log("- COPY . . && npm run build");
  console.log("- CMD [\"node\", \"dist/main.js\"]");
}