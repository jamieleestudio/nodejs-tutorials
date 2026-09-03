export const DESCRIPTION = "Learn inheritance and method overriding.";

abstract class Shape {
  abstract area(): number;
  describe(): string {
    return `Shape with area ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }
  area(): number {
    return Math.PI * this.radius ** 2;
  }
}

export function run(): void {
  console.log("Inheritance");
  const circle = new Circle(5);
  console.log(`- ${circle.describe()}`);
}