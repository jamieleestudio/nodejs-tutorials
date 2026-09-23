/** 请求日志拦截器 */
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import type { Request } from "express";
import { tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("HTTP");

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    const start = Date.now();
    return next.handle().pipe(
      tap(() => {
        this.logger.log(`${req.method} ${req.originalUrl} → ${Date.now() - start}ms`);
      }),
    );
  }
}
