# Svelte Firebase User Store

A small readable Svelte store that follows the current Firebase Authentication user.

## Install

```sh
npm install svelte-firebase-user-store
```

## Usage

Pass an initialized Firebase `Auth` instance to `createUserStore`. The returned value is a regular Svelte store, so use Svelte's `$store` syntax **inside a component** or `subscribe` outside a component.

This component example assumes your Firebase app was initialized before `getAuth()` is called:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { readable } from 'svelte/store';
  import type { User } from 'firebase/auth';
  import { getAuth } from 'firebase/auth';
  import { createUserStore } from 'svelte-firebase-user-store';

  // Safe initial value during server-side rendering.
  let authStore = readable<User | null | undefined>(undefined);

  // Initialize Firebase Auth and its listener in the browser only.
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

If you already have a browser-only `Auth` instance, you can create the store directly:

```ts
import { createUserStore } from 'svelte-firebase-user-store';
import { auth } from './firebase-client';

export const user = createUserStore(auth);
```

> For SSR frameworks such as SvelteKit, ensure that `./firebase-client` creates `auth` only on the client. The store itself does not register an auth listener on the server, but creating a Firebase `Auth` instance may still require browser APIs.

## Store values

- `undefined`: Firebase has not reported the initial auth state yet (also the SSR fallback).
- `null`: The user is signed out.
- `User`: The current signed-in Firebase user.

For non-component code, use `subscribe` instead of Svelte's `$store` syntax:

```ts
const unsubscribe = user.subscribe((currentUser) => {
  console.log('Auth state:', currentUser);
});

// Call this when the listener is no longer needed.
unsubscribe();
```

The Firebase listener is started when the first subscriber subscribes in a browser and removed when the last subscriber unsubscribes. No listener is started during SSR.
