<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; // Import the page store to access URL params
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '$lib/firebase';

  export let bio = '';
  export let displayName = '';

  onMount(async () => {
    console.log("Fetching profile for userId:", $page.params.userId);
    const userId = $page.params.userId; // Access the dynamic segment
    
    const docRef = doc(db, "users", userId, "userProfile", "profileInfo");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
    } else {
      console.log("No such document!");
    }
  });
</script>

<h1>User Profile</h1>
<h2>{displayName}</h2>
<h3>{bio}</h3>
<p>Visit <a href="/">Home</a></p>

