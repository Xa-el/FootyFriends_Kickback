<script lang="ts">
  import { doc, getDoc } from "firebase/firestore";
  import { onMount } from 'svelte';
  import { session } from '$lib/session';
	import { db } from '$lib/firebase';
  import { goto } from '$app/navigation';


  let bio = '';
  let displayName = '';
  let userId;

  // Assuming `db` and `userId` are defined and available
    // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
    } else {
      console.log("No such document!");
    }
  };
  // You need to ensure these are correctly initialized and available in this script context
  onMount(async () => {
    session.subscribe(($session) => {
      if ($session.user) {
        userId = $session.user.uid;
        fetchUserProfile(userId);
      } else {
        // User is not logged in, redirect or handle accordingly
        goto('/login');
      }
    });
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }

    // const docTestRef = doc(db, "users", "4uWhCwLaqYMclKELqnKmc3z5Wnt1" , "userProfile", "profileInfo");
    // const testSnap = await getDoc(docTestRef);
    // if (testSnap.exists()) {
    //   console.log("Test Snap Document data:", testSnap.data());
    // } else {
    //   // docSnap.data() will be undefined in this case
    //   console.log("No such document!");
    // }

  });
</script>
<h1 class="text-4xl">Hello</h1>
<h2>Display Name: {displayName}</h2>
<h3>Bio: {bio}</h3>
<p>Visit <a href="/">Home</a></p>


