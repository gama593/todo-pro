# Todo Pro

A personal, offline-first productivity application built with React, TypeScript, Vite, and Dexie/IndexedDB.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Architecture

The application is built around a local IndexedDB database through Dexie. Domain models and persistence are kept independent from the UI so cloud synchronization and AI providers can be added later.

## Data

Tasks, projects, and tags are stored locally. The browser database is the source of truth and survives reloads and offline usage.
