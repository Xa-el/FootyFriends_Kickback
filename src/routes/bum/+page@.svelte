<script lang="ts">
	import "../../app.css";
	import { onMount } from 'svelte';
	import { session } from '$lib/session.js';
	import { goto } from '$app/navigation';
	import { doc, getDoc, collection, getDocs, query, orderBy, deleteDoc} from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { writable } from 'svelte/store';
	import Post from '../../components/Post.svelte';

	let displayName = '';
	let userId;
	let profile_url = '';
	let userCity = '';
	const posts = writable([]);


	const fetchUserProfile = async (userId) => {
		const docRef = doc(db, "users", userId);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			displayName = docSnap.data().display_name;
			userCity = docSnap.data().City
			profile_url = docSnap.data().pfpURL;
			return userCity; // Return user city for further use
		} else {
			console.log("No such document!");
			return null; // Return null if user document doesn't exist
		}
	};

	const removePost = async (postId) => {
		try {
			await deleteDoc(doc(db, userCity, "feed", "posts", postId));
			console.log("Post successfully deleted!");
		} catch (error) {
			console.error("Error removing post: ", error);
		}
	};


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
</script>

<div class="w-2/3 h-screen bg-forest-green-500 flex flex-col">
	<div class="post-container flex-grow flex flex-col items-center" style="white-space: pre-wrap;">
		{#each $posts as post}
			<div class="post-wrapper">
				<Post {post} />
				<button class="remove-button" on:click={() => removePost(post.id)}>X</button>
			</div>
		{/each}
	</div>
</div>