# Svelte Firebase User Store

A small readable [Svelte store](https://svelte.dev/docs/svelte/stores) that follows the current [Firebase Authentication](https://firebase.google.com/docs/auth) user.

> **Maintenance status:** this repository's latest declared package version is **0.0.3**. The repository now includes a guard against starting an auth listener during server-side rendering, but **the published npm package has not been republished or verified here**. Its current package metadata still declares a Svelte 3 peer dependency. Support for Svelte 4/5 and the latest SvelteKit remains a separate upgrade/testing task.

## Installation

```bash
npm install svelte-firebase-user-store
```

Ensure Firebase is initialized in your app before calling `getAuth()`.

## Usage in a Svelte component

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { readable } from 'svelte/store';
  import { getAuth, type User } from 'firebase/auth';
  import { createUserStore } from 'svelte-firebase-user-store';

  let authStore = readable<User | null | undefined>(undefined);

  onMount(() => {
    authStore = createUserStore(getAuth());
  });
</script>

{#if $authStore === undefined}
  <p>Checking authentication...</p>
{:else if $authStore === null}
  <p>Please sign in.</p>
{:else}
  <p>Welcome, {$authStore.displayName ?? $authStore.email ?? 'user'}!</p>
{/if}
```

Svelte's `$authStore` auto-subscription syntax works **inside a Svelte component**. In a regular TypeScript module, call `authStore.subscribe(callback)` and retain the unsubscribe function.

## Store values

| Value | Meaning |
| --- | --- |
| `undefined` | Initial/loading state, including on the server |
| `null` | Firebase has confirmed that the user is signed out |
| `User` | Firebase has returned an authenticated user |

The repository implementation registers a Firebase auth listener when the first subscriber starts **in the browser**, and removes it when the last subscriber unsubscribes. During SSR, it leaves the value `undefined` and does not register an auth listener.

**Important:** this guard does **not** make it safe to construct a Firebase client-side `Auth` instance during SSR. Initialize Firebase Auth in browser-only code, for example in Svelte's `onMount`.

## Development and package validation

```bash
npm install
npm run check
npm run package
npm run build
```

The repository is a **library**, not a deployed web service. Cloudflare hosting and build checks are not configured for it. [Dependabot](.github/dependabot.yml) checks npm dependencies weekly; no GitHub Actions workflows were introduced.

## Known work

- Upgrade and test peer dependencies for supported modern Svelte versions.
- Migrate the package tooling from the older SvelteKit release.
- Add full browser/SSR automated tests against installed dependencies.
- Adopt Bun and a committed modern lockfile after compatibility checks.
- Publish a new npm release **only after** checks pass and the package version is intentionally updated.
