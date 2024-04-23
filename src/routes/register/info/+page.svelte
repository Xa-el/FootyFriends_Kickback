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
  let city = '';
  let displayName = '';
  let userId: any = ''; // Should change later to a specific type
  let pfpURL = '';
  let userCity = '';

  // Fetch user profile information
  const fetchUserProfile = async (userId: any) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
      pfpURL = docSnap.data().pfpURL;
      userCity = docSnap.data().city;
    } else {
      console.log("No such document!");
    }
  };



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
    city = userCity;
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

<style>
  .full-height {
    height: 100vh; /* This ensures the parent div takes the full height */
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
    border-radius: 5px;
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
</style>
<div class="flex h-screen w-screen flex-col">
  <div class="header border-b-2 border-forest-green flex justify-between items-center w-full h-15">
      <div class="flex flex-row">
            <div class="logo flex flex-row" >
                <img src="/logo.png" alt="KICKBACK Logo" />
                <h1 class="ml-2 font-bold">KICKBACK</h1>
            </div>
      </div>
  </div>


  <div class="flex items-center justify-center overflow-hidden grow">
      <div class=" bg-side-green border border-neon-green rounded-lg pt-5 pb-5 pr-8 pl-8 w-2/6">
          <h1 class="mb-5 text-neon-green text-center font-extrabold text-4xl">Account Details</h1>
          <form on:submit|preventDefault={updateProfile}>
            <div class="flex flex-row items-center w-full justify-between">
                <p class="font-bold text-neon-green mr-10">Display Name:</p>
                <input class="inputButton w-3/5" bind:value={userSeenName} type="text" placeholder="IGN" />
            </div>
            <br>
            <div class="flex flex-row items-center w-full justify-between">
                <p class="font-bold text-neon-green">Bio:</p>
                <input class="inputButton w-3/5" bind:value={displayBio} placeholder="Bio" />
            </div>
            <br>
            <div class="flex flex-row items-center w-full justify-between">
                <p class="font-bold text-neon-green">PFP Image URL:</p>
                <input class="inputButton w-3/5" bind:value={pfpURL} placeholder="Image URL" />
            </div>
            <br>
            <!-- ADD CITY DROP DOWN RIGHT BELOW THIS, TO DO LATER. BUT ALSO FIGURE OUT FIREBASE STUFF-->

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
            <button class="createButton text-3xl text-dark-green font-bold pt-2 pb-2 pr-12 pl-12 bg-neon-green hover:bg-forest-green" type="submit" >Done</button>
          </form>
          <!-- <p class=" mt-2.5 text-neon-green font-bold">Forgot Account?</p> -->
        <div class="newActions font-bold">
        </div>
      </div>
      <div class = "textbox">
      </div>
  </div>
</div>

