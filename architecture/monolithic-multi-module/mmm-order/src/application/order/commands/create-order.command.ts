export class CreateOrderCommand {
  constructor(readonly userId: string, readonly amount: number) {}
}