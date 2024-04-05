<script lang="ts">
	import { doc, getDoc } from "firebase/firestore";
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import { db } from '$lib/firebase';

	let userId;

	const fetchUserProfile = async (userId) => {
		// Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
		const docRef = doc(db, "users", userId, "userProfile", "profileInfo"); // Adjusted path
		const docSnap = await getDoc(docRef);

	};

	onMount(async () => {
		session.subscribe(($session) => {
			if ($session.user) {
				userId = $session.user.uid;
				fetchUserProfile(userId);
			}
		});
	});
</script>

<h1>Welcome to Home page</h1>




<p>Visit <a href="/welcome">Welcome</a></p>
<p>Visit <a href="/register">Register</a></p>
<p>Visit <a href="/login">Login</a></p>
<p>Visit <a href="/layout">Layout</a></p>
<p>Visit <a href="/profile">Profile</a></p>
<p>Visit <a href="{`/profile/${userId}`}" target="_blank">Different profile thing, trying to do with dynamic links</a></p>
<p>Visit <a href="/posts">Posts</a></p>
<p>Visit <a href="/search">Search</a></p>
