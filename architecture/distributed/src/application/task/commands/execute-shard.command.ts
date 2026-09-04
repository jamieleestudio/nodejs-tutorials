export class ExecuteShardCommand {
  constructor(
    readonly taskId: string,
    readonly workerId: string,
    readonly payload: string,
  ) {}
}