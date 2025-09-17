# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm start` - Start Expo Metro bundler (add `--clear` to clear cache)
- `pnpm android` / `pnpm ios` / `pnpm web` - Run on specific platforms
- `pnpm lint` - Run ESLint checks
- `pnpm generate:api` - Generate TypeScript types from NestJS Swagger API

### Database Commands

- `pnpm db:push` - Apply Drizzle schema to SQLite database
- `pnpm db:studio` - Launch Drizzle Studio browser tool

### Build Commands

- `npx eas build -p android` - Build Android APK
- `npx eas build -p ios` - Build iOS IPA (requires Apple Developer account)

## Project Architecture

### Core Stack

- **Framework**: React Native with Expo SDK + expo-router for file-based routing
- **Language**: TypeScript (strict mode)
- **UI**: NativeWind (Tailwind CSS for React Native) + react-native-reanimated
- **State**: Zustand for global state management
- **Database**: SQLite (expo-sqlite) + Drizzle ORM for offline-first data
- **API**: React Query + OpenAPI TypeScript bindings
- **Package Manager**: pnpm

### Key Architecture Patterns

#### Offline-First Data Flow

- Local SQLite database as single source of truth
- Sync queue (`lib/sync/`) handles background synchronization with backend
- All CRUD operations work offline, sync when online
- Database schema in `lib/db/schema.ts` with Drizzle ORM

#### Provider Structure

- `providers/app-provider.tsx` wraps the entire app with:
  - React Query client for API state
  - Database provider for SQLite connection
  - Online/offline manager
  - Sync processor for background sync
  - Sentry monitoring initialization

#### File-based Routing

- `app/_layout.tsx` - Root layout with providers and navigation theme
- `app/(tabs)/` - Bottom tab navigation structure
- `app/modal.tsx` - Modal screens (e.g., sync details)

#### State Management

- Zustand stores in `stores/` for different domains:
  - `session-store.ts` - Workout session state
  - `sync-store.ts` - Synchronization status
  - `settings-store.ts` - User preferences

#### Data Layer Organization

- `lib/db/client.ts` - SQLite connection setup
- `lib/db/repository.ts` - Data access layer with CRUD operations
- `lib/sync/` - Background sync logic and queue management
- `lib/api/` - React Query hooks and API client configuration

### Database Schema

Main entities:

- `liftSessions` - Workout sessions with volume tracking
- `liftSets` - Individual sets with weight, reps, RPE
- `syncQueue` - Pending sync operations for offline-to-online data flow

### Configuration Files

- `drizzle.config.ts` - Database migrations and schema config
- `nativewind.config.ts` + `tailwind.config.ts` - Styling configuration
- `babel.config.js` - Uses `react-native-worklets/plugin` for Reanimated

## Development Guidelines

### Code Style

- Components: PascalCase, functional with hooks, keep under 200 lines
- Hooks & stores: camelCase
- Use TypeScript strict mode
- Follow existing NativeWind class ordering: layout → colors → text styles

### Testing

- React Native Testing Library + Jest
- Test files: `ComponentName.test.tsx` alongside components
- Focus on data layer testing with Drizzle repositories
- Set `EXPO_USE_DEV_SERVER=false` for CI

### Commit Convention

- Follow Conventional Commits: `feat:`, `fix:`, `chore:`
- Include screenshots/recordings for UI changes
- Ensure `pnpm lint` passes before commits

## Important Notes

- This is a fitness tracking app with offline-first architecture
- Always test on real devices with Expo Go for best results
- The app supports both Chinese and English (primarily Chinese UI)
- Backend API runs on localhost:3000 during development
- Use `pnpm` as package manager (configured in package.json)

## Development Environment

- **Platform**: WSL2 (Windows Subsystem for Linux)
- **Project Path**: `/mnt/d/a_github/ReactNative/LiftUp`
- **Build Environment**: Windows host (compilation runs on Windows side)
- **File System**: Cross-platform file access between WSL and Windows
