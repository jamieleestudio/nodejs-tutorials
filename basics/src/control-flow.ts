export const DESCRIPTION = "Learn if statements and loops.";

export function run(): void {
  console.log("Control Flow");
  const score: number = 85;
  console.log(score >= 60 ? "- Pass" : "- Fail");
  for (const keyword of ["if", "for", "while"]) {
    console.log(`- keyword: ${keyword}`);
  }
}