<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session.js';
	import { goto } from '$app/navigation';
	import { doc, getDoc, query, collection, getDocs } from 'firebase/firestore';
	import { db } from '$lib/firebase';

	let displayName = '';
	let userId;
	let userCity = '';
	let pfpURL = '';

	const fetchUserProfile = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			displayName = docSnap.data().display_name;
			pfpURL = docSnap.data().pfpURL;
			userCity = docSnap.data().City;
			console.log("Display Name: " + displayName + " PFP URL: " + pfpURL);
			return userCity; // Return user city for further use
		} else {
			console.log("No such document!");
			return null; // Return null if user document doesn't exist
		}
	};

	onMount(async () => {
		session.subscribe(async ($session) => {
			if ($session.user) {
				userId = $session.user.uid;
				userCity = await fetchUserProfile(userId); // Fetch user profile and get the user's city

				if (userCity) { // Check if userCity is available
					const cityDocRef = doc(db, userCity); // Assuming the collection name is "cities"
					const cityDocSnap = await getDoc(cityDocRef);

					if (cityDocSnap.exists()) {
						const cityName = cityDocSnap.data().name;
						const q = query(collection(db, cityName)); // Assuming "cityName" matches the collection name
						const querySnapshot = await getDocs(q);

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

