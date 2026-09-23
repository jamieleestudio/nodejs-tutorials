# Architecture — NestJS + DDD + Clean Architecture（pnpm + Turborepo）

七种后端架构模式教学工程，目录组织对齐 `java-tutorials/architecture`（Maven 聚合 pom + 前缀命名 + 模块拆分），工程化采用 **pnpm workspaces + Turborepo**。

## 与 java-tutorials/architecture 的对应关系

| 本目录 | java-tutorials 对应 | 包前缀 / scope | 部署单元 |
|---|---|---|---|
| `monolithic/` | `monolithic/` | `@arch/monolithic` | 1 进程 |
| `monolithic-multi-module/` | `monolithic-multi-module/` (mmm-*) | `@mmm/*` | 1 进程（多包组装，类比 fat jar） |
| `distributed/` | `distributed/` (dist-*) | `@dist/*` | Master + N Worker 进程 |
| `event-driven/` | `event-driven/` (eda-*) | `@eda/*` | 独立服务 + Redis pub/sub |
| `microservices/` | `microservices/` (ms-*) | `@ms/*` | 独立服务 + TCP RPC + 网关 |
| `cloud-native/` | `cloud-native/` (cn-*) | `@cn/*` | 容器 / K8s（12-factor） |
| `erp/` | `erp/` (erp-*) | `@erp/*` | COLA 分层单应用 |

领域上下文：**Order + User**（java 版为 order/product/payment，本仓库保留现有 order/user 代码资产）。java 的 `erp-app-*` 子应用在本仓库简化为单个 `erp-app`。

## Workspace 结构（Maven reactor 的对应物）

```
architecture/
├── pnpm-workspace.yaml          ← workspace 声明（≈ 根 pom 的 <modules>）
├── package.json                 ← packageManager: pnpm, scripts → turbo run
├── turbo.json                   ← 任务编排：build/typecheck/test/start（≈ reactor 构建顺序）
├── tsconfig.base.json           ← 所有包共享的编译选项
├── docker-compose.yml           ← PostgreSQL（多库）+ Redis
├── monolithic/…
├── monolithic-multi-module/
│   ├── mmm-shared-kernel/       ← 纯 TS 内核：Entity/AggregateRoot + 跨模块事件契约
│   ├── mmm-user/                ← User 上下文（独立库 arch_mmm_user）
│   ├── mmm-order/               ← Order 上下文（独立库 arch_mmm_order）
│   └── mmm-bootstrap/           ← 启动装配（≈ bootstrap fat jar）
├── distributed/
│   ├── dist-shared-kernel/  dist-task-core/  dist-master/  dist-worker/
├── event-driven/
│   ├── eda-shared-kernel/  eda-event-bus/  eda-order-service/  eda-user-service/  eda-demo/
├── microservices/
│   ├── ms-shared-kernel/  ms-user-service/  ms-order-service/  ms-api-gateway/  ms-demo/
├── cloud-native/
│   ├── cn-shared-kernel/  cn-user-service/  cn-order-service/  deploy/（Dockerfile/compose/k8s）
└── erp/
    ├── erp-shared-kernel/  erp-platform/  erp-module/  erp-app/  erp-architecture-test/
```

**包间依赖（编译期单向，Turbo 按此拓扑调度）：**

```
mmm-bootstrap → @mmm/order → @mmm/user → @mmm/shared-kernel
dist-master / dist-worker → @dist/task-core → @dist/shared-kernel
@ms/demo → @ms/{user,order}-service, api-gateway → @ms/shared-kernel
@eda/{order,user}-service → @eda/event-bus → @eda/shared-kernel
@cn/order-service → @cn/shared-kernel（User 服务通过 REST 定位）
@erp/app → @erp/module → @erp/platform → @erp/shared-kernel
```

包采用 **JIT 模式**（`exports` 直接指向 `src/index.ts`）：消费方由 tsx 运行 TS 源码、由 tsc 做类型检查，无需预编译产物；`turbo run build` 承担 Maven `package` 的校验角色（typecheck + 缓存）。

## 分层结构（所有业务包一致）

```
src/
├── domain/            # 纯 TS — 实体、值对象、仓储端口（零框架依赖）
├── application/       # 用例 / 应用服务 / DTO
├── interfaces/        # Controller、HTTP 请求 DTO（驱动适配器）
└── infrastructure/    # Prisma、仓储实现、外部客户端（被驱动适配器）
```

依赖规则：只能由外向内。`domain/` 不依赖任何框架；`infrastructure/` 实现 `domain/` 定义的端口。

## 各模式要点

| 模式 | 通信 | 数据库 | 事件 |
|---|---|---|---|
| monolithic | 进程内直接 DI | arch_monolithic | 无 |
| monolithic-multi-module | EventBus（进程内 pub/sub） | 每上下文一库 | OrderCreatedEvent（契约在 shared-kernel） |
| distributed | HTTP（Master → Worker 分片） | arch_dist | 无 |
| event-driven | Redis pub/sub（异步、时间解耦） | 每服务一库 | order.created（topic 契约） |
| microservices | TCP RPC + API Gateway | 每服务一库 | 无（请求-响应） |
| cloud-native | REST（12-factor backing services） | 每服务一库 | 无 |
| erp | 进程内 EventBus + 平台组件 | arch_erp（单库） | OrderCreatedEvent |

## 快速开始

前置：Node.js ≥ 20、pnpm ≥ 9（`corepack enable`）、Docker。

```bash
cd architecture

# 1. 启动基础设施（PostgreSQL 多库 + Redis）
pnpm docker:up

# 2. 安装依赖 + 生成 Prisma Client
pnpm install
pnpm prisma:generate

# 3. 建表（每个有 schema 的包执行 prisma migrate dev）
pnpm --filter "@mmm/*" --filter @arch/monolithic --filter @dist/task-core \
      --filter "@ms/*" --filter "@eda/*" --filter "@cn/*" --filter @erp/module run prisma:migrate

# 4. 类型检查 / 测试（Turborepo 按依赖图调度 + 缓存）
pnpm build          # tsc --noEmit（所有包）
pnpm test           # erp 架构守护测试

# 5. 运行某个模式的演示（各自跑完即退出）
pnpm start:monolithic   # 单体
pnpm start:mmm          # 单体多模块
pnpm start:dist         # 分布式（Master + 3 Worker）
pnpm start:ms           # 微服务（网关 + 2 服务）
pnpm start:eda          # 事件驱动（需要 Redis）
```

cloud-native 通过容器编排运行：

```bash
cd cloud-native
docker compose -f deploy/docker-compose.yml up -d --build
curl http://localhost:4500/healthz
```

## 环境变量

复制 `.env.example` 为 `.env`（仓库已提供模板）。每个模式/服务拥有独立数据库，由 `docker/init/01-create-databases.sql` 自动创建：

```
DATABASE_URL_MONOLITHIC / DATABASE_URL_MMM_USER / DATABASE_URL_MMM_ORDER /
DATABASE_URL_DIST / DATABASE_URL_MS_USER / DATABASE_URL_MS_ORDER /
DATABASE_URL_EDA_ORDER / DATABASE_URL_EDA_USER /
DATABASE_URL_CN_USER / DATABASE_URL_CN_ORDER / DATABASE_URL_ERP
REDIS_URL=redis://localhost:6379/0
```

## Turborepo 常用命令

```bash
turbo run build --filter=@mmm/order     # 只构建某包（含其上游依赖）
turbo run build --filter=...@mmm/order  # 含下游
turbo run typecheck                     # 全量类型检查（命中缓存秒回）
```
