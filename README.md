# Orion

A responsive, local-first project-management prototype built with Next.js, React, and TypeScript.

## Run

```sh
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

Visit `http://localhost:3000`. No environment variables or service credentials are needed.

## Features

- Workspace overview with live progress metrics and recent activity.
- Create and search projects; open a project to view its tasks.
- Create and edit tasks with project, assignee, priority, due date, and status.
- List and kanban board views; update status with inline selectors or completion controls.
- Project cards with calculated task completion.
- Sample team directory and one-click assigned-task views.
- Workspace naming, JSON export and a two-step demo-data reset.
- Browser-local persistence, keyboard-friendly dialogs, and mobile navigation.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm run build
npx playwright test
```

Playwright expects an already-running app at `http://localhost:3000`, or a different URL supplied via `BASE_URL`.

## Prototype boundaries

The original brief did not specify a product, so Orion is assumed to be a personal project-management workspace. Sample projects and people initialize the app. Data is saved in the current browser's localStorage, not a server. The four sample teammates are local demo records; assigning tasks does not send notifications. There is no authentication, real-time collaboration, email service, or production deployment. A production version would need a database/API, user and workspace authorization, a real invitation service, and operational hardening. Dates use November 13, 2026 as the sample-data reference; activity created by users uses their current browser time.
