<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { doc, getDoc, setDoc } from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';
  import { writable, derived } from 'svelte/store';

  let displayBio = ''
  let userSeenName = ''
  let bio = '';
  let displayName = '';
  let userId;
  let pfpURL = '';
  let pfp = '';

  // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
      pfpURL = docSnap.data().pfpURL;
    } else {
      console.log("No such document!");
    }
  };

  let email: string = '';
  let password: string = '';

  function goToHome(){


    console.log("function called");
    //this function is being called, its the directory. idk yet figure out later so I dont waste writes
    goto('/');

    const reloadAfterRedirect = () => {
      window.location.reload();
    };

    // Wait for the page to redirect, then reload
    setTimeout(reloadAfterRedirect, 1000);
  }

  // Update user profile information
  async function updateProfile() {

    // Check if any of the required fields are empty
    if (!userSeenName || !displayBio || !pfpURL || !$search) {
      console.log("Please fill in all required fields.");
      return; // Exit the function if any field is empty
    }

    // Adjusted document reference
    bio = displayBio;
    displayName = userSeenName;
    pfpURL = pfpURL;
    const userProfileRef = doc(db, "users", userId); // Adjusted path
    //console.log("user prof ref: " + userProfileRef);
    try {
      // Using setDoc with merge true to create or update
      await setDoc(userProfileRef, {
        bio : bio,
        display_name: displayName,
        pfpURL : pfpURL,
      }, { merge: true });

      console.log("Profile updated successfully");
      // goto('/');
      //could below this cause an error
      displayBio = '';
      userSeenName = '';
      pfpURL = '';
          goToHome();


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

  function selectCity(city) {
    search.set(city);
    showDropdown.set(false);
  }

  function checkHideDropdown(event) {
    // Only hide dropdown if the event related target is not a dropdown item
    if (!event.relatedTarget || !event.relatedTarget.classList.contains('dropdown-item')) {
      showDropdown.set(false);
    }
  }
</script>

<style>
  .full-height {
    height: 100vh; /* This ensures the parent div takes the full height */
  }
  .neonLine{
    outline: 1px solid #6A863D; /* Sets width, style, and color */
    border-radius: 10px;
    width: 650px; /* Sets the width of the main container */
    height: 450px; /* Sets the height of the main container */
  }

  .neonLine-Error{
    outline: 1px solid #6A863D; /* Sets width, style, and color */
    border-radius: 10px;
    width: 650px; /* Sets the width of the main container */
    height: 100px; /* Sets the height of the main container */
  }


  .inputButton{
    outline: 2px solid #6A863D;
    border-radius: 5px;
    background: #002615;
    color: white;
    border: none;
    width: 375px; /* Sets the width of the button */
    height: 50px; /* Sets the height of the button */
    font-size: 18px; /* Adjust this based on your preference */
    padding: 0 15px; /* Horizontal padding, vertical padding is not necessary due to height setting */
    text-align: left;
    line-height: 50px; /* This helps center the text vertically */
  }
  .centy{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  form{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .loginButt{
    border: none;
    border-radius: 5px;
    width: 230px;
    height: 50px;
    background: #002615;
    font-size: 30px;
  }

  .newActions{
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
  }
  .createButton{
    border: none;
    background: #C3F53C;
    border-radius: 5px;
    width: 230px;
    height: 50px;
    font-size: 20px;
  }
  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    color: white;
    font-size: 1.5rem;
  }
  .header {
     display: flex;
     justify-content: space-between;
     padding: 10px 20px;
     align-items: center;
     color: #C3F53C; /* Neon green text */
     background: #013A21;
  }
  .header .logo {
     cursor: pointer;
     font-size: 24px;
     font-weight: bold;
  }


     .dropdown-content {
       position: absolute;
       background-color: #f9f9f9;
       min-width: 160px;
       box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
       z-index: 1;
       display: none; /* Initial state set to none, controlled by Svelte */
     }

     .dropdown-item {
       padding: 12px 16px;
       text-decoration: none;
       display: block;
       cursor: pointer;
     }

     .dropdown-item:hover {
       background-color: #f1f1f1;
     }
</style>

<div class="header border-b-2 border-forest-green flex justify-between items-center w-full h-15">
     <div class="flex flex-row">
          <div class="logo flex flex-row" >
               <img src="/logo.png" alt="KICKBACK Logo" />
               <h1 class="ml-2 font-bold">KICKBACK</h1>
          </div>
     </div>
</div>


<div class="flex items-center justify-center overflow-hidden h-[calc(100vh-60px)]">
  <div>
    <div class="p-4 bg-side-green neonLine">
      <div class="centy">
        <h1 class="mb-5 text-neon-green text-center font-extrabold text-4xl">Account Details</h1>
        <form on:submit|preventDefault={updateProfile}>
          <div class="flex flex-row items-center">
               <p class="font-bold text-neon-green">Display Name:</p>
               <input class="m-2 inputButton" bind:value={userSeenName} type="text" placeholder="IGN" />
          </div>
          <br>
          <div class="flex flex-row items-center">
               <p class="font-bold text-neon-green">Bio:</p>
               <input class="m-2 inputButton" bind:value={displayBio} placeholder="Bio" />
          </div>
          <br>
          <div class="flex flex-row items-center">
               <p class="font-bold text-neon-green">PFP Image URL:</p>
               <input class="m-2 inputButton" bind:value={pfpURL} placeholder="Image URL" />
          </div>
          <br>
          <!-- ADD CITY DROP DOWN RIGHT BELOW THIS, TO DO LATER. BUT ALSO FIGURE OUT FIREBASE STUFF-->

          <div class="flex flex-row items-center">
            <p class="font-bold text-neon-green">City:</p>

          <input
            class="m-2 inputButton"
            type="text"
            placeholder="Type to search..."
            bind:value={$search}
            on:focus={() => showDropdown.set(true)}
            on:blur={checkHideDropdown}
          />

          <div class="dropdown-content" style:display={$showDropdown ? 'block' : 'none'}>
            {#each $filteredCities as city}
              <div
                on:click={() => selectCity(city)}
                class="dropdown-item rounded-md border-2 border-neon-green bg-dark-green"
                tabindex="0">
                {city}
              </div>
            {/each}
          </div>
          </div>
          <button class="createButton text-3xl text-dark-green font-bold" type="submit" >Done</button>
        </form>
        <!-- <p class=" mt-2.5 text-neon-green font-bold">Forgot Account?</p> -->
      </div>
      <div class="newActions font-bold">
      </div>
    </div>
    <div class = "textbox">
    </div>
  </div>
</div>

