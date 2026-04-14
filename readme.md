# zao

Audio and podcast app built with Nuxt, Capacitor, and Appwrite.

This repo contains the web app, mobile packaging, and backend functions used around the service.

## How It Works

The frontend is a Nuxt SPA with SSR disabled so the same codebase can power both the web app and the Capacitor mobile app. Appwrite handles authentication, document storage, and file storage, while the repository's serverless functions handle username management, premium/subscription sync, and checkout-related flows.

The player can stream audio from Appwrite storage, and the mobile side also supports offline downloads through the Capacitor SQLite plugin.

## Run

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Android

```bash
pnpm android
```

## Config

Appwrite and runtime settings live in `appwrite.json` and `nuxt.config.ts`.

## Notes

- This repo is not fully self-contained: it expects an Appwrite project and related secrets.
- Subscription flows depend on the backend functions and external billing configuration.
- Mobile packaging expects a built app output for Capacitor.

## Screenshots

![home](./readme-assets/Screenshot%202025-07-26%20at%2014-57-57%20Zao.png)
![library](./readme-assets/Screenshot%202025-07-26%20at%2014-58-04%20Bibliothèque%20Zao.png)
![podcast page](./readme-assets/Screenshot%202025-07-26%20at%2014-59-40%20elvis%20-%20if%20i%20can%20dream%20Zao.png)
![settings](./readme-assets/Screenshot%202025-07-26%20at%2014-59-46%20Compte%20\_%20Paramètres%20Zao.png)
