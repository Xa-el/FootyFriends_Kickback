<!-- SettingsPage.svelte -->
<script lang="ts">
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import { doc, setDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';



	async function createPost() {
		console.log("post called");
		if ($postCaption.trim() == "") {
			console.log("No caption inputted");
			return;
		}

		if($postCaption.length > 184){
			console.log("post too long");
			return;
		}
		const cityPostRef = doc(db, userCity, "feed", "posts", randomPostId); // Adjusted path
		try {
			// Using setDoc with merge true to create or update
			const currentTime = await getCurrentTime();
			await setDoc(cityPostRef, {
				likes: likesPost,
				u_id: userId,
				time: currentTime,
				title: title,
				caption: $postCaption,
				isLiked: isLiked,
			}, { merge: true });

			console.log("Post created successfully");
			window.location.reload();
		} catch (error) {
			console.error("Error updating profile: ", error);
		}
	}


	
	onMount(() => {
		session.subscribe(($session) => {
			if (!$session.user) {
				goto('/login');
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


