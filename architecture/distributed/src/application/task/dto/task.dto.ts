/** Task 输出 DTO */
export interface TaskDto {
  readonly id: string;
  readonly payload: string;
  readonly result: string | null;
  readonly status: string;
  readonly workerId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}