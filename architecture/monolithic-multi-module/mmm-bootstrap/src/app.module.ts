/**
 * AppModule — Bootstrap 装配根模块
 *
 * 类比 java mmm-bootstrap（组装 1 个 fat jar）：
 * - 只 import 业务上下文模块，不写业务代码
 * - OrderModule 内部会拉起 UserModule（order → user 依赖方向）
 * - EventBus 由 OrderModule 中的 CqrsModule 提供（Discovery 全局扫描，
 *   UserModule 的 @EventsHandler 会被自动订阅）
 */

import { Module } from "@nestjs/common";
import { OrderModule } from "@mmm/order";

@Module({
  imports: [OrderModule],
})
export class AppModule {}
