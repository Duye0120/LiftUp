
# Repository Guidelines — LiftUp

## 🖥️ 环境说明

- 当前在 WSL 环境 `/mnt/d/a_github/ReactNative/LiftUp` 中进行代码开发
- 项目编译与打包在 Windows 端执行

## 📂 Project Structure & Module Organization

- `app/` — Expo Router file-based routes  
  - `app/_layout.tsx` — 全局 providers (React Query, Zustand, Theme)  
  - `app/(tabs)/` — 底部 Tab 页（Dashboard / Workouts / Cardio / Metrics）
- `src/`
  - `ui/` — 复用 UI 组件（Button, Card, Typography）
  - `store/` — Zustand 状态切片
  - `db/` — Drizzle schema、SQLite 客户端与 repository
  - `api/` — React Query hooks、OpenAPI 类型绑定
  - `utils/` — 工具函数
- `assets/` — 静态资源 (icons, images, fonts)
- `types/` — TypeScript ambient types (e.g. env.d.ts)
- 根目录配置文件：
  - `babel.config.js`, `tailwind.config.js`, `nativewind.config.js`
  - `drizzle.config.ts`, `eslint.config.js`

---

## 🛠️ Build, Test, and Development Commands

- `pnpm start` — 启动 Expo Metro bundler  
  - 加 `--clear` 清缓存：`pnpm start -- --clear`
- `pnpm android` / `pnpm ios` / `pnpm web` — 在对应平台打开
- `pnpm lint` — ESLint 检查  
- `pnpm generate:api` — 从 NestJS Swagger 更新 TS 类型  

```bash
  npx openapi-typescript http://localhost:3000/swagger-json -o src/api/types.ts
````

- `pnpm db:push` — 应用 Drizzle schema 到 SQLite
- `pnpm db:studio` — 启动 Drizzle Studio 浏览器工具
- `node scripts/reset-project.js` — 清理依赖和缓存（用于疑难问题）

---

## 🎨 Coding Style & Naming Conventions

- **语言**：TypeScript（strict mode）
- **组件**：函数式 + Hooks，尽量 <200 行
- **命名**：

  - Components: `PascalCase`
  - Hooks & stores: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
- **Tailwind 类顺序**：从布局 → 颜色 → 文本样式
  e.g. `className="flex-1 items-center justify-center bg-black text-white"`
- **文件归属**：功能/领域代码就近放置
- **Lint & 格式化**：

  - ESLint 配置在 `eslint.config.js`
  - Prettier 使用 Expo 默认
  - 每次提交前执行：`pnpm lint --fix`

---

## 🧪 Testing Guidelines

- **工具**：React Native Testing Library + Jest
- **单元测试**：与组件同级命名为 `ComponentName.test.tsx`
- **数据层测试**：覆盖 Drizzle repo，使用固定输入确保确定性
- **mock 策略**：只 mock `expo-sqlite` 或网络层
- **快照**：少用，仅用于 UI 回归
- **CI 注意**：

  - 运行测试时设置 `EXPO_USE_DEV_SERVER=false`
  - 确保每次用例前清理 Zustand store / 本地 DB

---

## 📦 Commit & Pull Request Guidelines

- 遵循 [Conventional Commits](https://www.conventionalcommits.org) 前缀：

  - `feat:` 新功能
  - `fix:` Bug 修复
  - `chore:` 配置/依赖更新
- **PR 内容**：

  - 用户影响（对功能/界面的改动）
  - 实现要点（如何实现，涉及哪些模块）
  - 手动验证步骤（例：`pnpm start` + Android 真机测试）
- **UI 改动**：附上截图或录屏
- **关联问题**：在 PR 描述里链接 issue/Linear ticket
- **合并前**：至少 1 个 Reviewer 通过

---

## ✅ Definition of Done (DoD)

- 功能在真机 Expo Go 上可运行
- 本地数据可离线 CRUD；联网后可同步
- 至少 2 条集成测试通过
- UI 在常见屏幕尺寸无重大阻塞
- 关键路径报错可通过 Sentry 观测
