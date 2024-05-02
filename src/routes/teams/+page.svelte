<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, doc, getDoc, getDocs, orderBy, query,} from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';
  import Post from '../../components/Post.svelte';
  import { writable, derived } from 'svelte/store';

  import "../../app.css";

  let bio = '';
  let displayName = '';
  let userId;
  let pfpURL = '';
  let userCity = '';
  const posts = writable([]);

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
  onMount(async () => {
    session.subscribe(async ($session) => {
      if ($session.user) {
        userId = $session.user.uid;
        await fetchUserProfile(userId); // Fetch user profile and get the user's city
        if (userCity) { // Check if userCity is available
          const cityDocRef = collection(db, userCity, "feed", "posts");
          const sortedQuery = query(cityDocRef, orderBy("time", "desc")); // Adjusted query to limit the initial fetch to batchSize
          const querySnapshot = await getDocs(sortedQuery);
          const loadedPosts = [];

          querySnapshot.forEach((doc) => {
            const postData = doc.data();
            console.log("Post ID:", doc.id);
            console.log("Title:", postData.title);
            console.log("Caption:", postData.caption);
            console.log("Likes:", postData.likes);
            console.log("Time:", postData.time);
            console.log("User ID:", postData.u_id);

            if(userId == postData.u_id) {
              loadedPosts.push({
                id: doc.id,
                title: postData.title,
                caption: postData.caption,
                likes: postData.likes,
                time: postData.time,
                userId: postData.u_id,
              });
            }
          });
          posts.set(loadedPosts);
        } else {
          console.log("No such city document!");
        }
      } else {
        // User is not logged in, redirect or handle accordingly
        goto('/login');
        const reloadAfterRedirect = () => {
          window.location.reload();
        };
        // Wait for the page to redirect, then reload
        setTimeout(reloadAfterRedirect, 1000);
      }
    });
  });

  let cities = ['Gainesville, FL', 'Miami, FL', 'Orlando, FL', 'Tampa, FL', 'Jacksonville, FL'];
  let showDropdown = writable(false);
  let search = writable('');

  let filteredCities = derived(search, $search => {
    showDropdown.set($search.length > 0);
    if ($search.length > 0) {
      return cities.filter(city => city.toLowerCase().includes($search.toLowerCase()));
    } else {
      return [];
    }
  });

  function selectCity(city: string) {
    search.set(city);
    userCity = city;
    showDropdown.set(false);
  }

  function checkHideDropdown(event: any) {
    // Only hide dropdown if the event related target is not a dropdown item
    if (!event.relatedTarget || !event.relatedTarget.classList.contains('dropdown-item')) {
      showDropdown.set(false);
    }
  }
</script>

<div class="w-5/6 h-full ml-80 fixed">
  <h2 class="text-neon-green font-bold text-3xl mt-5 ">Teams</h2>

  <div class="flex justify-center">
    <div class="border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex flex-row">
    <div class="flex flex-row items-center w-full justify-between">
      <p class="font-bold text-neon-green">City:</p>

      <input
      class="inputButton w-3/5 border"
      type="text"
      id="city_input"
      placeholder="Type to search..."
      bind:value={$search}
      on:focus={() => showDropdown.set(true)}
      />
    </div>
    <div class="relative mb-11 w-full flex flex-col items-end">
      {#if $search.length > 0 && $filteredCities.length > 0 && $showDropdown}
        <div class="absolute z-10 w-3/5 border bg-side-green rounded-lg">
          {#each $filteredCities as city}
            <button class="p-2 text-neon-green bg-forest-green w-full hover:cursor-pointer hover:bg-green-700 text-left" on:click={() => {
              selectCity(city);
              showDropdown.set(false);
            }}>{city}</button>
          {/each}
        </div>
      {/if}
    </div>
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
</div>

<style>
    .inputButton{
    outline: 2px solid #6A863D;
    border-radius: 5px;
    background: #002615;
    color: white;
    border: none;
    font-size: 18px; /* Adjust this based on your preference */
    padding: 0 15px; /* Horizontal padding, vertical padding is not necessary due to height setting */
    text-align: left;
    line-height: 50px; /* This helps center the text vertically */
  }
</style>