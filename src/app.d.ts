/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare namespace App {
	interface Locals {
		userSession?: UserSession;
	}
	// interface Platform {}
	interface Session {
		userSession?: UserSession;
	}
	// interface Stuff {}
}
