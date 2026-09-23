/**
 * AppModule — ERP 应用装配层（COLA 的 bootstrap）
 *
 * 只做三件事：
 * 1. import 业务模块（@erp/module）
 * 2. 注册平台级全局组件（过滤器、拦截器 —— 来自 @erp/platform）
 * 3. 不写任何业务代码
 */

import { Module } from "@nestjs/common";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionsFilter, LoggingInterceptor } from "@erp/platform";
import { ErpOrderModule, ErpUserModule } from "@erp/module";

@Module({
  imports: [ErpUserModule, ErpOrderModule],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
  ],
})
export class AppModule {}
