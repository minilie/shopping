# Repository Guidelines

## Project Structure & Module Organization
The main HarmonyOS app lives in `List_commodity/`. Core ArkTS source is under `List_commodity/entry/src/main/ets`, with feature areas split into `pages/`, `view/`, `viewmodel/`, `common/`, and `entryability/`. App resources (images, strings, colors) are in `List_commodity/entry/src/main/resources`, and module metadata is in `List_commodity/entry/src/main/module.json5`. Build outputs are under `List_commodity/entry/build` and should not be edited. Root-level docs `require.md` and `judge.md` describe course requirements and grading.

## Build, Test, and Development Commands
Open `List_commodity` in DevEco Studio 6.0.0+ and use the IDE Run/Build actions to install on a device or emulator. If the HarmonyOS SDK tools are on your PATH, you can build from `List_commodity` with `hvigor assembleHap` and clean with `hvigor clean`. There are no repo-local scripts for build or test orchestration.

## Coding Style & Naming Conventions
Use ArkTS (`.ets`) with the existing 2-space indentation and fluent UI builder style. Components and classes are `PascalCase` (for example `GoodsListComponent`, `EntryAbility`), and file names follow the same pattern in `view/` and `viewmodel/`. Keep constants in `CommonConstants.ets`. Lint rules are defined in `List_commodity/code-linter.json5` (performance and TypeScript ESLint presets); run the DevEco Studio linter against `.ets` sources.

## Testing Guidelines
No automated tests are currently configured. Validate changes manually on a device/emulator by exercising pull-to-refresh, lazy loading, and list bounce behavior. If you add tests later, place them under `entry/src/test` or `entry/src/ohosTest` and use descriptive `*.ets` filenames (for example `ListIndex.test.ets`).

## Commit & Pull Request Guidelines
The existing git history uses short, informal summaries; keep commit messages concise and action-oriented (around one line). For pull requests, include a clear change description, the DevEco Studio/HarmonyOS SDK versions used, and screenshots or a GIF for UI changes. Note any new assets and their source/license in the PR description.

## Environment & Configuration Notes
This sample targets HarmonyOS 5.0.5+ and DevEco Studio 6.0.0+ (see `List_commodity/README.md`). App-level config lives in `List_commodity/oh-package.json5` and `List_commodity/build-profile.json5`, while module config is in `List_commodity/entry/oh-package.json5` and `List_commodity/entry/build-profile.json5`.
