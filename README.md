# LiftUp! 🏋️‍♂️

**LiftUp!** 是一个基于 [React Native](https://reactnative.dev/) 与 [Expo](https://expo.dev/) 的健身日志应用。
目标是提供 **离线优先** 的训练记录体验：你可以随时记录训练、有氧和体重体脂，联网时自动同步。

---

## ✨ Features

* 📱 **跨平台**：iOS / Android / Web（Expo 支持）
* 📴 **离线优先**：本地 SQLite（Drizzle ORM），无网也能用
* 🏋️ **训练记录**：支持重量、次数、RPE，快速录入
* 🫀 **有氧记录**：爬楼、跑步、心率区间
* ⚖️ **体重/体脂快照**：每日追踪
* 📊 **统计分析**：周/月训练量趋势
* 🔔 **提醒**：本地通知，训练/饮食提醒
* ☁️ **同步**：联网后自动与后端合并（NestJS + Postgres）
* 🔒 **鉴权**：匿名可用，登录后云备份
* 🛠️ **扩展**：支持传感器（expo-sensors）、健康平台（HealthKit/Google Fit）

---

## 🏗️ Tech Stack

* **框架**：React Native (Expo SDK) + expo-router
* **语言**：TypeScript (strict)
* **UI**：NativeWind (Tailwind 风格) + Reanimated
* **状态管理**：Zustand
* **数据层**：SQLite (expo-sqlite) + Drizzle ORM
* **网络层**：React Query + OpenAPI 类型绑定
* **后端**：NestJS + Postgres + Prisma
* **通知**：expo-notifications
* **构建/分发**：EAS Build & OTA Updates
* **测试**：React Native Testing Library + Jest
* **监控**：sentry-expo

---

## 🚀 Getting Started

### 1. Clone

```bash
git clone https://github.com/yourname/liftup.git
cd liftup
pnpm install
```

### 2. Run on Device

```bash
pnpm start          # 默认启动 Expo
pnpm start -- --clear  # 清缓存启动
```

* 真机：手机装 Expo Go → 扫码
* Android 模拟器：`pnpm android`
* iOS 模拟器（macOS only）：`pnpm ios`

### 3. Database Setup

```bash
pnpm db:push     # 应用 Drizzle schema
pnpm db:studio   # 浏览器查看 SQLite 数据
```

---

## 🧪 Testing

```bash
pnpm test
```

* 使用 [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
* 测试文件命名：`ComponentName.test.tsx`
* 数据层测试覆盖 Drizzle repositories

---

## 📦 Build & Release

```bash
npx eas login
npx eas build -p android   # Android 包
npx eas build -p ios       # iOS 包（需 Apple 开发者账号）
npx eas update --branch production --message "OTA update"
```

---

## 📖 Repository Guidelines

请参考 [Repository Guidelines](./AGENT.md) 获取详细的代码规范、测试策略与 PR 流程。

---

## ✅ Roadmap (MVP)

* [ ] 训练 CRUD（本地 + 云同步）
* [ ] 有氧记录
* [ ] 体重/体脂模块
* [ ] 基础统计报表
* [ ] 通知提醒
* [ ] 云端登录/同步
* [ ] EAS 内测包

---

## 🧑‍💻 Contributing

欢迎 PR！请遵循 [Conventional Commits](https://www.conventionalcommits.org) 规范。
提交前请确保：

* 通过 `pnpm lint` 和 `pnpm test`
* 附上截图/录屏（UI 改动）
* 关联 issue/任务链接

---

## 📜 License

MIT © 2025 LiftUp! Contributors
