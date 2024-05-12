<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, doc, getDoc, getDocs, setDoc, orderBy, query,} from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';
  import Post from '../../../components/Post.svelte';
  import { writable, derived } from 'svelte/store';

  import "../../../app.css";

  let bio = '';
  let bioCopy = '';
  let displayBio = ''
  let displayName = '';
  let userId;
  let pfpURL = '';
  let userCity = '';
  let postHistory = true;
  let likeHistory = false;
  const loadedLikes = [];


  const posts = writable([]);
  const likes = writable([]);

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

  async function updateProfile() {
// Adjusted document reference
if (displayBio == ''){
  bio = bioCopy;
}
else {
  bio = displayBio;
}
let city = userCity;

console.log("This is the bio:" + bio)

const userProfileRef = doc(db, "users", userId); // Adjusted path
//console.log("user prof ref: " + userProfileRef);
try {
  // Using setDoc with merge true to create or update
  await setDoc(userProfileRef, {
    bio : bio,
    display_name: displayName,
    pfpURL : pfpURL,
    City : userCity
  }, { merge: true });

  console.log("Profile updated successfully");
  // goto('/');
  //could below this cause an error
  displayBio = '';

} catch (error) {
  console.error("Error updating profile: ", error);
}
}


  // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      bioCopy = docSnap.data().bio;
      displayName = docSnap.data().display_name;
      pfpURL = docSnap.data().pfpURL;
      userCity = docSnap.data().City;

    } else {
      console.log("No such document!");
    }
  };

  async function inputLikedPost(postId, userID, postData) {
       const likesRef = collection(db, userCity, "feed", "posts", postId, "likeIds");
       const snapshot = await getDocs(likesRef);
       snapshot.forEach((doc) => {
        console.log("userId" + userID);
        console.log("postID: " + postId);
         if(userID == doc.id) {
          loadedLikes.push({
                  id: doc.id,
                  title: postData.title,
                  caption: postData.caption,
                  likes: postData.likes,
                  time: postData.time,  
                  userId: postData.u_id,
              });
         }
       });
}

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

            
            inputLikedPost(doc.id, userId, postData);

        });
          posts.set(loadedPosts);
          likes.set(loadedLikes);
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

      <form on:submit|preventDefault={updateProfile}>
      
      <button on:click={() => goto('/profile/')} class="createButton text-3xl text-dark-green font-bold pt-2 pb-2 pr-12 pl-12 bg-neon-green absolute top-16 right-16 rounded-full hover:ring-2 hover:ring-neon-green" type="submit">Save</button>
      <div class="flex flex-row items-center w-full justify-between">
        <p class="text-white font-bold text-2xl"><span class="text-neon-green">City:</span>
        <input
        class="inputButton w-3/5 border-2 border-forest-green bg-side-green rounded-full placeholder-white font-bold text-2xl pl-3 outline-none focus:border-forest-green"
        type="text"
        id="city_input"
        autocomplete="off"
        placeholder= {userCity}
        bind:value={$search}
        on:focus={() => showDropdown.set(true)}
        />
      </div>
      <div class="relative w-full flex flex-col place-items-center">
        {#if $search.length > 0 && $filteredCities.length > 0 && $showDropdown}
          <div class="top-full mt-1 md:mt-0 w-full md:w-3/5 absolute z-10 border border-forest-green bg-side-green rounded-lg" style="margin-left: -9%;">
            {#each $filteredCities as city}
              <button class="p-2 text-white font-bold w-full hover:cursor-pointer hover:bg-green-700 text-left" on:click={() => {
                selectCity(city);
                showDropdown.set(false);
              }}>{city}</button>
            {/each}
          </div>
        {/if}
      </div>

      <div class="w-4/6 pt-2 fixed">
        <input
        class="inputButton w-full border-2 border-forest-green bg-side-green rounded-lg placeholder-white text-white text-xl pl-3 pt-2 pb-4 outline-none focus:border-forest-green"
        type="text"
        bind:value={displayBio}
        placeholder= {bio}
        />
      </div>
      </form>

    </div>

  </div>
  
  <div class="flex items-center justify-center mt-48">
      <div class=" border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex flex-col w-full items-center">
    <div class="mr-16 mt-4">
      <p class="font-bold text-2xl text-neon-green">Favorites</p>
    </div>

      <div class="flex flex-row space-x-96 items-center mr-14 mt-7">
				<div class="flex flex-col items-center">
					<img src="https://b.fssta.com/uploads/application/soccer/competition-logos/EnglishPremierLeague.png" alt="league" class="w-36 h-36 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-2xl text-center mt-7">League</p>
				</div>

				<!-- club -->
				<div class="flex flex-col items-center">
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" alt="club" class="w-36 h-36 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-2xl text-center mt-7">Club</p>
				</div>

				<!-- GOAT -->
				<div class="flex flex-col items-center">
					<img src="https://b.fssta.com/uploads/application/soccer/headshots/66617.png" alt="goat" class="w-36 h-36 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-2xl text-center mt-7">GOAT</p>
				</div>
			</div>
  </div>
  
  


</div>




<!-- <script lang="ts">
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
 -->
