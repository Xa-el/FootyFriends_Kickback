<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session.js';
	import { goto } from '$app/navigation';
	import { setDoc, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { writable}  from 'svelte/store';
	import Post from '../../components/Post.svelte';

	const posts = writable([]);

	function generateRandomString(length: number): string {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';

		for (let i = 0; i < length; i++) {
			const randomIndex = Math.floor(Math.random() * characters.length);
			result += characters.charAt(randomIndex);
		}
		return result;
	}

	const randomPostId = generateRandomString(26);



	 let displayName = '';
	let userId;
	let userCity = '';
	let title = '';
	let likesPost = 0;
	let postCaption = 'From code 3';


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

		const cityPostRef = doc(db, userCity, "feed", "posts", randomPostId); // Adjusted path
		//console.log("user prof ref: " + userProfileRef);
		try {
			// Using setDoc with merge true to create or update
			await setDoc(cityPostRef, {
				display_name: displayName,
				likes : likesPost,
				u_id : userId,
				time : Date.now(),
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
					const cityDocRef = collection(db, userCity, "feed", "posts");
					const sortedQuery = query(cityDocRef, orderBy("time", "desc")); // Create a query with sorting by "time" in descending order
					const querySnapshot = await getDocs(sortedQuery);
					const loadedPosts = [];

					querySnapshot.forEach((doc) => {
						const postData = doc.data();
						console.log("Post ID:", doc.id);
						console.log("Title:", postData.title);
						console.log("Caption:", postData.caption);
						console.log("Display Name:", postData.display_name);
						console.log("Likes:", postData.likes);
						console.log("Time:", postData.time);
						console.log("User ID:", postData.u_id);

						loadedPosts.push({
							id: doc.id,
							title: postData.title,
							caption: postData.caption,
							displayName: postData.display_name,
							likes: postData.likes,
							time: postData.time,
							userId: postData.u_id
						});

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
</script>

<style>
    .post-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
</style>

<div class="post-container">
	{#each $posts as post}
		<Post {post} />
	{/each}
</div>

<button class="createButton" on:click={createPost}>Create Post</button>



