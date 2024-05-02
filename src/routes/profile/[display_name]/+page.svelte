<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; 
  import { doc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
  import { db } from '$lib/firebase';

  export let bio = '';
  export let displayName = '';
  export let pfpURL = '';
  export let userCity = '';

  onMount(async () => {
    try {
      console.log("Fetching profile for displayName:", $page.params.display_name);
      displayName = $page.params.display_name;
      const q = query(collection(db, "users"), where("display_name", "==", displayName));

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          bio = doc.data().bio;
          displayName = doc.data().display_name;
          pfpURL = doc.data().pfpURL;
          userCity = doc.data().City;
        } else {
          console.log("No such document!");
        }
      });
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
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
