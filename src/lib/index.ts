import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';
import { onAuthStateChanged } from 'firebase/auth';
import type { Auth, User } from 'firebase/auth';
import { BROWSER } from 'esm-env';

/**
 * Creates a readable store that tracks Firebase Authentication state.
 *
 * The store contains `undefined` until Firebase resolves the auth state,
 * `null` when signed out, and a Firebase User when signed in.
 *
 * During server-side rendering, the value remains `undefined`. No Firebase
 * listener is registered on the server. In the browser, the listener is
 * registered on the first subscription and cleaned up when the last
 * subscriber unsubscribes.
 */
export function createUserStore(auth: Auth): Readable<User | null | undefined> {
    return readable<User | null | undefined>(undefined, (set) => {
        if (!BROWSER) {
            return;
        }

        return onAuthStateChanged(auth, set);
    });
}
