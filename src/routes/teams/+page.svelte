<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, doc, getDoc, getDocs, orderBy, query,} from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';
  import Post from '../../components/Post.svelte';
  import { writable, derived } from 'svelte/store';

  import "../../app.css";

  let isVisible = writable(false); // This will control the visibility of the searched-container

  let bio = '';
  let displayName = '';
  let userId;
  let pfpURL = '';
  let userCity = '';
  const posts = writable([]);
	const apiKey = import.meta.env.VITE_FOOTBALL_KEY;

	const options = {
		method: 'GET',
		headers: {
			'X-Auth-Token': apiKey,
			'Cache-Control': 'no-cache'  // Instructs to bypass the cache
		}
	};

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
        // if (userCity) { // Check if userCity is available
        //   const cityDocRef = collection(db, userCity, "feed", "posts");
        //   const sortedQuery = query(cityDocRef, orderBy("time", "desc")); // Adjusted query to limit the initial fetch to batchSize
        //   const querySnapshot = await getDocs(sortedQuery);
        //   const loadedPosts = [];

        //   querySnapshot.forEach((doc) => {
        //     const postData = doc.data();
        //     console.log("Post ID:", doc.id);
        //     console.log("Title:", postData.title);
        //     console.log("Caption:", postData.caption);
        //     console.log("Likes:", postData.likes);
        //     console.log("Time:", postData.time);
        //     console.log("User ID:", postData.u_id);

        //     if(userId == postData.u_id) {
        //       loadedPosts.push({
        //         id: doc.id,
        //         title: postData.title,
        //         caption: postData.caption,
        //         likes: postData.likes,
        //         time: postData.time,
        //         userId: postData.u_id,
        //       });
        //     }
        //   });
        //   posts.set(loadedPosts);
        // } else {
        //   console.log("No such city document!");
        // }
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



  let choice = "";  // This can be set dynamically as needed
  let choiceId = -1;  // Default to -1 or any sentinel value indicating "not found"

  let cities = [
    "Arsenal FC",
    "Aston Villa FC",
    "Chelsea FC",
    "Everton FC",
    "Fulham FC",
    "Liverpool FC",
    "Manchester City FC",
    "Manchester United FC",
    "Newcastle United FC",
    "Tottenham Hotspur FC",
    "Wolverhampton Wanderers FC",
    "Burnley FC",
    "Nottingham Forest FC",
    "Crystal Palace FC",
    "Sheffield United FC",
    "Luton Town FC",
    "Brighton & Hove Albion FC",
    "Brentford FC",
    "West Ham United FC",
    "AFC Bournemouth"
  ];

  let cityIds = [
    57,    // Arsenal FC
    58,    // Aston Villa FC
    61,    // Chelsea FC
    62,    // Everton FC
    63,    // Fulham FC
    64,    // Liverpool FC
    65,    // Manchester City FC
    66,    // Manchester United FC
    67,    // Newcastle United FC
    73,    // Tottenham Hotspur FC
    76,    // Wolverhampton Wanderers FC
    328,   // Burnley FC
    351,   // Nottingham Forest FC
    354,   // Crystal Palace FC
    356,   // Sheffield United FC
    389,   // Luton Town FC
    397,   // Brighton & Hove Albion FC
    402,   // Brentford FC
    563,   // West Ham United FC
    1044   // AFC Bournemouth
  ];

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


    if (cities.includes(city)) {
        let index = cities.indexOf(city);
        choiceId = cityIds[index];
    }

    // userCity = city;
    showDropdown.set(false);
    isVisible.set(true); // Set this to true when a city is selected

    console.log("clicked team: " + city);
    console.log("You picked team id with " + choiceId);  // This will log 57 if choice is "Arsenal FC"
    getRecentMatches(choiceId);
  }

  function checkHideDropdown(event: any) {
    // Only hide dropdown if the event related target is not a dropdown item
    if (!event.relatedTarget || !event.relatedTarget.classList.contains('dropdown-item')) {
      showDropdown.set(false);
    }
  }
  
	let teamMatches;


	const teamImages = {
        TottenhamHotspurFC: 'https://i.ibb.co/hyhWqX4/tottenham.jpg',
        NottinghamForestFC: 'https://i.ibb.co/d2Qhy5R/nottingham.jpg',
        ManchesterCityFC: 'https://i.ibb.co/7Y0P6x1/manchestercity.jpg',
        BrightonNHoveAlbionFC: 'https://i.ibb.co/5nQKnVP/brighton.jpg',
        ArsenalFC: 'https://i.ibb.co/zmBMXR9/arsenal.jpg',
        AFCBournemouth: 'https://i.ibb.co/dpmM1XG/bournemouth.jpg',
        WolverhamptonWanderersFC:'https://i.ibb.co/92htgDQ/wolves.jpg',
        WestHamUnitedFC:'https://i.ibb.co/Ns6w2f3/westham.jpg',
        SheffieldUnitedFC:'https://i.ibb.co/zQZMZY1/sheffield.jpg',
        NewcastleUnitedFC:'https://i.ibb.co/BLG3b3r/newcastle.jpg',
        ManchesterUnitedFC:'https://i.ibb.co/FhxthPg/manunited.jpg',
        LutonTownFC:'https://i.ibb.co/xD87z64/lutontown.jpg',
        LiverpoolFC:'https://i.ibb.co/thWYZMy/liverpool.jpg',
        FulhamFC:'https://i.ibb.co/k6zZwwt/fulham.jpg',
        EvertonFC:'https://i.ibb.co/fQWzc3Z/everton.jpg',
        CrystalPalaceFC:'https://i.ibb.co/PWTsMpK/crystalpalace.jpg',
        ChelseaFC:'https://i.ibb.co/YNw18cs/chelsea.jpg',
        BurnleyFC:'https://i.ibb.co/T05FXkt/burnley.jpg',
        BrentfordFC:'https://i.ibb.co/2NhwgSs/brentford.jpg',
        AstonVillaFC : 'https://i.ibb.co/6wWPG9M/astonvilla.jpg',
        // Add all other teams following the same format
    };


	async function getRecentMatches(choiceId) {
		try {
			const teamId = choiceId; // Ensure teamId is defined if not globally available
			const matchesUrl = `https://corsproxy.io/?${encodeURIComponent(`http://api.football-data.org/v2/teams/${teamId}/matches`)}`;
			const response = await fetch(matchesUrl, options);
			const data = await response.json();
			console.log("Recent matches fetched:");
			
			// Filter out matches where status is 'SCHEDULED'
			const filteredMatches = data.matches.filter(match => match.status !== 'SCHEDULED');
			// console.log(filteredMatches); // Log filtered matches for debugging

			// Use only the last three matches after filtering
			teamMatches = filteredMatches.slice(-4);
			console.log("Last three matches:", teamMatches);

			const matchesContainer = document.getElementById('searched-container');
			if (!matchesContainer) return;
			matchesContainer.innerHTML = ''; // Clear previous entries

			teamMatches.reverse().forEach(match => {
				const matchElement = document.createElement('div');
        let homeTeamKey = match.homeTeam.name.replace(/\s+/g, '').replace(/&/g, 'N');
        let awayTeamKey = match.awayTeam.name.replace(/\s+/g, '').replace(/&/g, 'N');
        let homeTeamImg = teamImages[homeTeamKey];
        let awayTeamImg = teamImages[awayTeamKey];
        let gameUrl = `https://www.google.com/search?q=${encodeURIComponent(match.homeTeam.name + " " + match.awayTeam.name + " " + match.utcDate.split('T')[0])}`;

				matchElement.innerHTML = `
          <div class="flex">
            <!--Home-->
            <img src=${homeTeamImg} alt="home1" class="cursor-pointer w-14 h-14 object-cover rounded-full border-4 border-neon-green">
            <p>Home Team: ${match.homeTeam.name}</p>
          </div>
          <div class="flex">
            <!--Away-->
            <img src=${awayTeamImg} alt="home1" class="cursor-pointer w-14 h-14 object-cover rounded-full border-4 border-neon-green">
            <p>Away Team: ${match.awayTeam.name}</p>
          </div>
          <p onclick="window.open('${gameUrl}', '_blank');" class="cursor-pointer">Score: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
					<hr>
				`;
				matchesContainer.appendChild(matchElement);
			});        
		} catch (error) {
			console.error('Failed to fetch matches:', error);
		}
	}

  function hideContainer() {
    isVisible.set(false);
  }
  
  hideContainer();
</script>

<div class="w-5/6 h-full ml-80 fixed">
  <h2 class="text-neon-green font-bold text-3xl mt-5 ">Teams</h2>

  <div class="flex justify-center">
    <div class="border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex items-center justify-center grow">
    <div class="border-b-2 border-neon-green pt-5 pr-8 pl-8 w-4/6">
      <div class="flex flex-row items-center w-full justify-between">
        <p class="font-bold text-neon-green text-2xl ml-16">Search Teams:</p>

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
    </div>
    <!-- <img src="{pfpURL}" alt={"PFP"} class="w-48 h-48 object-fit rounded-full mt-8">
    <div class="flex flex-col justify-center ml-10">
      <p class="text-white font-bold text-4xl">{displayName}</p>
      <p class="text-white font-bold text-2xl"><span class="text-neon-green">City:</span> {userCity}</p>

      <div class="w-full overflow-y-auto">
        <p class="text-white w-full text-xl">{bio}</p>
      </div>

      
    </div> -->

  </div>
  
  <div class="flex items-center justify-center mt-8">
      <div class=" border-b-2 border-forest-green w-full ">
        <div class="flex items-center justify-center overflow-y-auto grow h-full">
        {#if $isVisible} <!-- This checks if isVisible is true -->
          <div id="searched-container" class="overflow-y-auto text-white bg-side-green border border-neon-green rounded-lg pt-5 pb-5 pr-8 pl-8 w-2/6 mb-4">
          </div>
        {/if}
        </div>
      </div>
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