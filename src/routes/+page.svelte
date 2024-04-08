<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';

	let userId;

	onMount(async () => {
		session.subscribe(($session) => {
			if ($session.user) {
				userId = $session.user.uid;
			}
		});
	});
</script>

<h1>Welcome to Home page</h1>




<p>Visit <a href="/welcome">Welcome</a></p>
<p>Visit <a href="/register">Register</a></p>
<p>Visit <a href="/login">Login</a></p>
<p>Visit <a href="/layout">Layout</a></p>
<p>Visit <a href="/profile">Edit Profile</a></p>
<p>Visit <a href="{`/profile/${userId}`}" target="_blank">Post Profile Data</a></p>
<p>Visit <a href="/posts">Posts</a></p>
<p>Visit <a href="/search">Search</a></p>
