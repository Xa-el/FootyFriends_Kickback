<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session.js';
	import { goto } from '$app/navigation';
	import { doc, getDoc, query, collection, getDocs, setDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	function generateRandomString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}

	function getCurrentTimeInEST(): string {
		const options: Intl.DateTimeFormatOptions = {
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
			timeZone: 'America/New_York', // EST timezone
			hour12: false // 24-hour format
		};

		return new Date().toLocaleString('en-US', options);
	}

	const randomPostId = generateRandomString(26);


	let randomizer = 99999999999999;



	let displayName = '';
	let userId;
	let userCity = '';
	let title = '';
	let likesPost = 0;
	let city = '';
	let postCaption = 'From code';


	const fetchUserProfile = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			displayName = docSnap.data().display_name;
			userCity = docSnap.data().City;
			return userCity; // Return user city for further use
		} else {
			console.log("No such document!");
			return null; // Return null if user document doesn't exist
		}
	};

	async function createPost() {
		// Adjusted document referenc
		city = userCity;
		const cityDocRef = collection(db, userCity, "feed", "posts"); // Reference to the "posts" collection within the user's city document
		const querySnapshot = await getDocs(cityDocRef);
		randomizer = randomizer-querySnapshot.size;

		const cityPostRef = doc(db, userCity, "feed", "posts", randomizer+randomPostId); // Adjusted path
		//console.log("user prof ref: " + userProfileRef);
		try {
			// Using setDoc with merge true to create or update
			await setDoc(cityPostRef, {
				display_name: displayName,
				likes : likesPost,
				u_id : userId,
				time : getCurrentTimeInEST(),
				title : title,
				caption : postCaption,
			}, { merge: true });

			console.log("Post created successfully");
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
					const cityDocRef = collection(db, userCity, "feed", "posts"); // Reference to the "posts" collection within the user's city document
					const querySnapshot = await getDocs(cityDocRef);

					querySnapshot.forEach((doc) => {
						const postData = doc.data();
						console.log("Post ID:", doc.id);
						console.log("Title:", postData.title);
						console.log("Caption:", postData.caption);
						console.log("Display Name:", postData.display_name);
						console.log("Likes:", postData.likes);
						console.log("Time:", postData.time);
						console.log("User ID:", postData.u_id);
					});
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

<button class="createButton" on:click={createPost}>Create Post</button>



