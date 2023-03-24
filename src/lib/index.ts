// Reexport your entry components here
import { readable } from "svelte/store"
import { onAuthStateChanged } from "firebase/auth"
import type { Auth, User, NextOrObserver } from "firebase/auth"
import { BROWSER } from 'esm-env'


/**
 * Creates a Svelte store that listens to changes in the Firebase Authentication state and updates accordingly.
 * @param {firebase.auth.Auth} auth - An instance of the Firebase Authentication service.
 * @returns {import('svelte/store').Readable<User | null | undefined>} A Svelte store that represents the Authentication state.
 *
 * The store can have one of three possible values:
 * - `undefined` - This is the initial value of the store before Firebase Authentication initializes. It can be used to show a splash screen or loading spinner while the Authentication state is being fetched.
 * - `null` - This value is set in the store if the user is not logged in.
 * - `User` - This value is set in the store if the user is logged in, and represents the user object returned by Firebase Authentication.
 */
export const createUserStore = (auth: Auth) => readable<User | null | undefined>(
    undefined,
    set => {

        /**
         * A callback function that is called whenever the Authentication state changes.
         * @param {firebase.User} user - The user object representing the current Authentication state.
         */
        const onAuthStateChange: NextOrObserver<User> = (user) => {
            // If running in a browser environment, update the store with the user object.
            if (BROWSER) {
                set(user)
            }
        }

        // Subscribe to changes in the Authentication state.
        const unsubscribe = onAuthStateChanged(
            auth, onAuthStateChange
        )

        // Return a function that used to unsubscribe from changes in the Authentication state.
        return () => unsubscribe()
    }
)