# Cloud-Native 镜像（两个服务共用一个基础镜像，入口由 compose/k8s 指定）
# 构建上下文 = architecture/ 根（pnpm workspace）：
#   docker build -f cloud-native/deploy/Dockerfile .
FROM node:22-alpine
RUN corepack enable
WORKDIR /app

# 1. 先拷贝清单，利用 Docker 层缓存安装依赖
COPY pnpm-workspace.yaml package.json tsconfig.base.json turbo.json ./
COPY cloud-native/cn-shared-kernel/package.json cloud-native/cn-shared-kernel/
COPY cloud-native/cn-user-service/package.json cloud-native/cn-user-service/
COPY cloud-native/cn-order-service/package.json cloud-native/cn-order-service/
RUN pnpm install --no-frozen-lockfile

# 2. 拷贝源码（JIT 包模式：直接运行 TS，无需预先 build）
COPY cloud-native cloud-native

# 3. prisma generate（构建期生成 Client；env 用占位值，仅要求变量存在）
ENV DATABASE_URL_CN_USER=postgresql://build:build@localhost:5432/build
ENV DATABASE_URL_CN_ORDER=postgresql://build:build@localhost:5432/build
RUN pnpm --filter @cn/user-service exec prisma generate \
 && pnpm --filter @cn/order-service exec prisma generate

EXPOSE 4400 4500
# 入口由 compose / k8s 指定：
#   cd cloud-native/cn-user-service  && node --import tsx src/main.ts
#   cd cloud-native/cn-order-service && node --import tsx src/main.ts
