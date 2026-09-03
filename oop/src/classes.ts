export const DESCRIPTION = "Learn classes, interfaces, and access modifiers.";

interface Animal {
  name: string;
  speak(): void;
}

class Dog implements Animal {
  constructor(public readonly name: string) {}

  speak(): void {
    console.log(`- ${this.name} says Woof!`);
  }
}

export function run(): void {
  console.log("Classes");
  const dog = new Dog("Rex");
  dog.speak();
}