export class DispatchTaskCommand {
  constructor(
    readonly payload: string,
    readonly workerUrls: string[],
  ) {}
}