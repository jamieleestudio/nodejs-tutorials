import { describe, it, expect } from "vitest";
import { add, greet } from "./math.js";

describe("math", () => {
  it("adds two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  it("greets by name", () => {
    expect(greet("Node")).toBe("Hello, Node!");
  });
});