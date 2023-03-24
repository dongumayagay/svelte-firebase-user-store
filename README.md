Svelte Firebase User Store
====================================

This is a package library that provides a Svelte store for Firebase Authentication. It allows you to listen for changes in the Authentication state and update your application accordingly.

Installation
------------

To use this package library in your Svelte project, you can install it via npm:

```bash
npm install svelte-firebase-user-store
```

Usage
-----

To use the Svelte Firebase User store, you will first need to initialize an instance of the Firebase Authentication service. You can then pass this instance to the `createUserStore` function to create a Svelte store that listens to changes in the Authentication state.

```bash
import { createUserStore } from 'svelte-firebase-user-store'
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const authStore = createUserStore(auth);
```

The `authStore` object returned by `createUserStore` is a Svelte store that represents the Authentication state. It can have one of three possible values:

* `undefined` - This is the initial value of the store before Firebase Authentication initializes. It can be used to show a splash screen or loading spinner while the Authentication state is being fetched.
* `null` - This value is set in the store if the user is not logged in.
* `User` - This value is set in the store if the user is logged in, and represents the user object returned by Firebase Authentication.

You can use this store in your Svelte components by subscribing to its changes:

```html
<script>
import { get } from 'svelte/store';
import { createUserStore } from 'svelte-firebase-user-store';
import { getAuth } from 'firebase/auth'; 

const auth = getAuth();
const authStore = createUserStore(auth);
// Get the current value of the store
const user = $authStore;
// Subscribe to changes in the store
$authStore.subscribe((user) => {
        console.log('Authentication state changed', user);
    }
);
</script>

{#if $authStore === undefined}
    <p>Loading...</p> 
{:else if $authStore === null}  
    <p>Please log in</p>
{:else}
    <p>Welcome, {get($authStore).displayName}!</p>
{/if}
```

In this example, we're using a conditional block to display different content depending on the value of the store. If the store's value is `undefined`, we show a loading spinner. If the store's value is `null`, we show a message asking the user to log in. And if the store's value is a `User` object, we display a welcome message with the user's display name.
