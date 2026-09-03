export const DESCRIPTION = "Learn docker-compose for multi-service orchestration.";

export function run(): void {
  console.log("docker-compose");
  console.log("- services: app, db, redis");
  console.log("- app depends_on db and redis");
  console.log("- ports, volumes, and environment wiring");
}