<script lang="ts">
	import "../app.css";
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { goto } from '$app/navigation';
	import { signOut } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	import type { LayoutData } from './$types';
	export let data: LayoutData;

	let loading: boolean = true;
	let loggedIn: boolean = false;

	session.subscribe((cur: any) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	onMount(async () => {
		const user: any = await data.getAuthUser();

		const loggedIn = !!user && user?.emailVerified;
		session.update((cur: any) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		if (loggedIn) {
			goto('/');
		}
	});

	export function logout() {
		signOut(auth)
			.then(() => {
				goto('/login');
				loggedIn = false;
			})
			.catch((error) => {
				throw new Error(error);
			});
	}
</script>

{#if loading}
	<div>Loading...</div>
{:else}
	<div>
		<slot>
		</slot>
	</div>
{/if}
