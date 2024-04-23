<script lang="ts">
	import { onMount } from 'svelte';
	import { collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	onMount(async () => {
		const querySnapshot = await getDocs(collection(db, 'users'));

		querySnapshot.forEach((doc) => {
			const userData = doc.data();
			console.log("User ID:", doc.id);
			console.log("Bio:", userData.bio);
			console.log("Display Name:", userData.display_name);
		});
	});
</script>