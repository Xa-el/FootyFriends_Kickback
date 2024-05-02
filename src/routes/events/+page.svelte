<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { writable } from 'svelte/store';


	let userCity = '';
	let userId;
	let postCaption = writable("");
	let title : string;

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
			if (!$session.user) {
				goto('/login');
			} else {
				userId = $session.user.uid;
				userCity = await fetchUserProfile(userId);
			}
		});
	});
</script>


<div class="w-5/6 h-full ml-80 fixed">
	<h2 class="text-neon-green font-bold text-3xl mt-5 ">Events</h2>

	<div class="flex justify-center">
		<div class="border-b-2 border-forest-green w-full "></div>
	</div>

	<div class="flex items-center justify-center grow">

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

<div class="flex items-center justify-center mt-48">
	<div class=" border-b-2 border-forest-green w-full "></div>
</div>



