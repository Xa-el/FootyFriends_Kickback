<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import { collection, doc, getDoc, getDocs, orderBy, query, setDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { writable } from 'svelte/store';
	import Events from '../../components/Events.svelte';


	let userCity = '';
	let userId;
	let postCaption = writable("");
	let title : string;
	const events = writable([]);


	function generateRandomString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}


	const fetchUserProfile = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			return docSnap.data().City; // Return user city for further use
		} else {
			console.log("No such document!");
			return null; // Return null if user document doesn't exist
		}
	};

	async function getCurrentTime() {
		// Get the current date and time in UTC
		const currentDate = new Date();
		// Get the current date and time in Eastern Standard Time (EST)
		const estDateTimeString = currentDate.toLocaleString('en-US', { timeZone: 'America/New_York' });
		// Parse the EST date and time string to get the timestamp
		const estDateTime = new Date(estDateTimeString);
		// Return the timestamp
		return estDateTime.getTime();
	}

	$: charCount = $postCaption.length;
	async function createEvent() {
		let eventID = generateRandomString(26);
		const cityPostRef = doc(db, userCity, "events", eventID); // Adjusted path
		if ($postCaption.trim() == "") {
			console.log("No caption inputted");
			return;
		}

		if($postCaption.length > 184){
			console.log("post too long");
			return;
		}
		try {
			// Using setDoc with merge true to create or update
			const currentTime = await getCurrentTime();
			await setDoc(cityPostRef, {
				u_id: userId,
				caption: $postCaption,
				time: currentTime,
				title: title,
		}, { merge: true });

			console.log("Post created successfully");
			window.location.reload();
		} catch (error) {
			console.error("Error updating profile: ", error);
		}
	}



	onMount(async () => {
		session.subscribe(async ($session) => {
			if ($session.user) {
				userId = $session.user.uid;
				userCity = await fetchUserProfile(userId); // Fetch user profile and get the user's city
				console.log("User city: " + userCity);
				if (userCity) { // Check if userCity is available
					const cityDocRef = collection(db, userCity, "feed", "posts");
					const sortedQuery = query(cityDocRef, orderBy("time", "desc")); // Adjusted query to limit the initial fetch to batchSize
					const querySnapshot = await getDocs(sortedQuery);
					const loadedEvents = [];

					querySnapshot.forEach((doc) => {
						const postData = doc.data();
						console.log("Post ID:", doc.id);
						console.log("Title:", postData.title);
						console.log("Caption:", postData.caption);
						console.log("Time:", postData.time);
						console.log("User ID:", postData.u_id);

						loadedEvents.push({
							id: doc.id,
							title: postData.title,
							caption: postData.caption,
							time: postData.time,
							userId: postData.u_id,
						});
					});

					events.set(loadedEvents);
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
	<h2 class="text-neon-green font-bold text-3xl mt-5">Events</h2>
	<div class="flex justify-center">
		<div class="border-b-2 border-forest-green w-full"></div>
	</div>
</div>
	<!-- Form for creating event -->
	<div class="input-container h-full mt-5 mb-5 w-5/6 border-b-2 border-b-forest-green">
		<div class="flex items-center w-5/6 text-2xl">
			<input type="text" id="eventTitle" bind:value={title} class="bg-transparent text-neon-green outline-none py-2 flex-grow w-full" placeholder="Event Title">
		</div>
		<div class="flex items-center w-5/6 text-2xl">
			<textarea id="eventCaption" bind:value={$postCaption} class="bg-transparent text-neon-green outline-none py-2 flex-grow w-full" placeholder="Event Description"></textarea>
			<div class="char-count text-xs text-neon-green {charCount > 184 ? 'over' : ''}">
				{charCount} / 184
			</div>
		</div>
		<div class="text-center justify-center py-2">
			<button type="button" style="transition-timing-function: ease;" on:click={createEvent}>
				Create Event
			</button>
		</div>
	</div>

	<!-- Existing events display -->
	<div class="w-full">
		{#each events as event}
			<Events {event} />
		{/each}
	</div>

<div class="flex items-center justify-center mt-48">
	<div class=" border-b-2 border-forest-green w-full "></div>
</div>




