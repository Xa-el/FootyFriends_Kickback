<script>
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '$lib/firebase'; // make sure you have a db export in your firebase.ts that refers to Firestore
  import { onMount } from 'svelte';

  let users = [];

  onMount(async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    users = querySnapshot.docs.map(doc => doc.data());
  });
</script>

<ul>
  {#each users as user}
    <li>{user.displayname}: {user.bio}</li>
  {/each}
</ul>

