	<script lang="ts">
		import { session } from '$lib/session';
		import { auth } from '$lib/firebase';
		import { onMount } from 'svelte';
		import { goto } from '$app/navigation';

		async function signOut() {
		await auth.signOut();
		session.set({
		loggedIn: false,
		user: null
	});
		goto('/'); // Redirect to the home page after signing out
	}

		// Optional: Redirect to the home page if the user is not logged in
		onMount(async () => {
		session.subscribe(($session) => {
			if (!$session.user) {
				goto('/');
			}
		});
	});
</script>

<div class="flex items-center justify-center">
	<button class="createButton text-white" on:click={signOut}>Sign Out</button>
</div>

