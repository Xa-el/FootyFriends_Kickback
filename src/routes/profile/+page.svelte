<script lang="ts">
  import { onMount } from 'svelte';
  import { auth, db } from '$lib/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';

  let displayBio = ''
  let userSeenName = ''
  let bio = '';
  let displayName = '';
  let userId;

  // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId, "userProfile", "profileInfo"); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
    } else {
      console.log("No such document!");
    }
  };

  // Update user profile information
  async function updateProfile() {
    // Adjusted document reference
    bio = displayBio;
    displayName = userSeenName;
    const userProfileRef = doc(db, "users", userId, "userProfile", "profileInfo"); // Adjusted path
    try {
      // Using setDoc with merge true to create or update
      await setDoc(userProfileRef, {
        bio : bio,
        display_name: displayName,
      }, { merge: false });

      console.log("Profile updated successfully");
      displayBio = '';
      userSeenName = '';
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  }

  // On component mount, fetch the user profile
  onMount(() => {
    session.subscribe(($session) => {
      if ($session.user) {
        userId = $session.user.uid;
        fetchUserProfile(userId);
      } else {
        // User is not logged in, redirect or handle accordingly
        goto('/login');
      }
    });
  });
</script>

<form on:submit|preventDefault={updateProfile}>
  <h2>Edit Profile</h2>
  <input bind:value={userSeenName} type="text" placeholder="Display Name" />
  <textarea bind:value={displayBio} placeholder="Bio"></textarea>
  <button type="submit">Update Profile</button>
</form>

<h2>User Profile</h2>
<p>Current Display Name: {displayName}</p>
<p>Current Bio: {bio}</p>



<p>Visit <a href="/">Home</a></p>
