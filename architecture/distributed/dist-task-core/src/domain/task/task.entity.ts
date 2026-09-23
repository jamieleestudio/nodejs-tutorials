/**
 * Task 领域实体
 *
 * 表示一个可分发的计算任务：
 * - payload：任务数据（如 JSON 字符串）
 * - result：任务执行结果（执行后填充）
 * - status：PENDING → RUNNING → COMPLETED / FAILED
 * - workerId：执行该任务的 worker 标识
 */

import { Entity } from "@dist/shared-kernel";

export type TaskStatus = "PENDING" | "RUNNING" | "COMPLETED" | "FAILED";

export class Task extends Entity<string> {
  private _payload: string;
  private _result: string | null;
  private _status: TaskStatus;
  private _workerId: string | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(
    id: string, payload: string, result: string | null, status: TaskStatus,
    workerId: string | null, createdAt: Date, updatedAt: Date,
  ) {
    super(id);
    this._payload = payload;
    this._result = result;
    this._status = status;
    this._workerId = workerId;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;
  }

  static create(params: { id?: string; payload: string }): Task {
    const now = new Date();
    return new Task(
      params.id ?? crypto.randomUUID(),
      params.payload, null, "PENDING",
      null, now, now,
    );
  }

  static reconstitute(params: {
    id: string; payload: string; result: string | null; status: TaskStatus;
    workerId: string | null; createdAt: Date; updatedAt: Date;
  }): Task {
    return new Task(params.id, params.payload, params.result, params.status, params.workerId, params.createdAt, params.updatedAt);
  }

  get payload(): string { return this._payload; }
  get result(): string | null { return this._result; }
  get status(): TaskStatus { return this._status; }
  get workerId(): string | null { return this._workerId; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  /** 标记为正在执行 */
  markRunning(workerId: string): void {
    this._status = "RUNNING";
    this._workerId = workerId;
    this._updatedAt = new Date();
  }

  /** 标记为已完成 */
  markCompleted(result: string): void {
    this._result = result;
    this._status = "COMPLETED";
    this._updatedAt = new Date();
  }

  /** 标记为失败 */
  markFailed(): void {
    this._status = "FAILED";
    this._updatedAt = new Date();
  }
}