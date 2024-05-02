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
  let userId = '';
  let pfpURL = '';
  let userCity = '';

  // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
      pfpURL = docSnap.data().pfpURL;
      userCity = docSnap.data().City;
    } else {
      console.log("No such document!");
    }
  };

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

<div class="w-5/6 h-full ml-80 fixed">
  <h2 class="text-neon-green font-bold text-3xl mt-5 ">Profile</h2>

  <div class="flex justify-center">
    <div class="border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex flex-row">
    <img src="{pfpURL}" alt={"PFP"} class="w-48 h-48 object-fit rounded-full mt-8">
    <div class="flex flex-col justify-center ml-10">
      <p class="text-white font-bold text-4xl">{displayName}</p>
      <p class="text-white font-bold text-2xl"><span class="text-neon-green">City:</span> {userCity}</p>

      <div class="w-full overflow-y-auto">
        <p class="text-white w-full text-xl">{bio}</p>
      </div>

      
    </div>


  </div>
  
  <div class="flex items-center justify-center mt-48">
      <div class=" border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex w-full justify-center">
    <div class="mr-16">
      <p class="font-bold text-2xl text-neon-green">Posts</p>
    </div>

    <div class="ml-16">
      <p class="font-bold text-2xl text-neon-green">Likes</p>
    </div>
  </div>
</div>
