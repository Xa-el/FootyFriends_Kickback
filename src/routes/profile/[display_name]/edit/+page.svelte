<script lang="ts">
    import { onMount } from 'svelte';
    import { db } from '$lib/firebase';
    import { doc, getDoc, setDoc } from 'firebase/firestore'; // Note: Using setDoc now
    import { session } from '$lib/session';
    import { goto } from '$app/navigation';
    import "../../app.css";
  
    let displayBio = ''
    let userSeenName = ''
    let bio = '';
    let displayName = '';
    let userId;
    
      // Update user profile information
  async function updateProfile() {
    // Adjusted document reference
    bio = displayBio;
    displayName = userSeenName;
    const userProfileRef = doc(db, "users", userId); // Adjusted path
    //console.log("user prof ref: " + userProfileRef);
    try {
      // Using setDoc with merge true to create or update
      await setDoc(userProfileRef, {
        bio : bio,
        display_name: displayName,
      }, { merge: true });

      console.log("Profile updated successfully");
      displayBio = '';
      userSeenName = '';
    } catch (error) {
      console.error("Error updating profile: ", error);
    }
  }
</script>


<form on:submit|preventDefault={updateProfile}>
    <h2>Edit Profile</h2>
    <input bind:value={userSeenName} type="text" placeholder="Display Name" />
    <textarea bind:value={displayBio} placeholder="Bio"></textarea>
    <button type="submit">Update Profile</button>
  </form>