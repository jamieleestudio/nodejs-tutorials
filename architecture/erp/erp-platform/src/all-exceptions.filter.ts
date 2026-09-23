/** 全局异常过滤器：把领域错误映射为 HTTP 状态码 */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import type { Response } from "express";
import { DomainError } from "@erp/shared-kernel";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const res = host.switchToHttp().getResponse<Response>();

    if (exception instanceof DomainError) {
      res.status(HttpStatus.BAD_REQUEST).json({ statusCode: 400, message: exception.message });
      return;
    }
    if (exception instanceof HttpException) {
      res.status(exception.getStatus()).json(exception.getResponse());
      return;
    }
    console.error("[ERP] Unhandled error:", exception);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ statusCode: 500, message: "Internal server error" });
  }
}
