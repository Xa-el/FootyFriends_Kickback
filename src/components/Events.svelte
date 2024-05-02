<script lang="ts">
	import { deleteDoc, setDoc, doc, collection, getDoc, getDocs, updateDoc, increment} from 'firebase/firestore';
import { db } from '$lib/firebase.js';
import { onMount } from 'svelte';
import { writable } from 'svelte/store';
import { session } from '$lib/session';
import { goto } from '$app/navigation';

	let displayName = '';
	let profile_url = '';
	let new_ID : string;
	let userCity : string;
	export let event;


	const fetchUserProfile = async (userId) => {
		console.log("Hello1 " + userId);
		const docRef = doc(db, "users", userId);
		console.log("Hello2 ");
		console.log(docRef);
		const docSnap = await getDoc(docRef);
		console.log("Hello3");
		if (docSnap.exists()) {
			displayName = docSnap.data().display_name;
			profile_url = docSnap.data().pfpURL;
			userCity = docSnap.data().City;
			console.log("display name: " + displayName);
		} else {
			console.log("No such document!");
		}
	}

	onMount(() => {
		fetchUserProfile(event.userId);
	});

</script>

<div class="text-white w-5/6 max-w-5/6 flex flex-row">
	<div class="h-full w-fit flex flex-col items-center min-w-24">
		<img on:click={() => goto(`/profile/${displayName}`)} src={profile_url} class="radi w-16 h-16 rounded-full border-neon-green">
	</div>
	<div class="flex flex-col h-full w-full max-w-full overflow-hidden">
		<div class="flex flex-row items-end">
			<h1 class="text-3xl mr-1">{displayName}</h1>
			<p style="color: #9F9F9F;">{new Date(event.time).toLocaleString()}</p>
		</div>
		<div class="max-w-full grow pt-1">
			<p class="max-w-full h-full break-words">{event.caption}</p> <!-- fix this later like without the margin top it looks scuffed and there is an extra line for some reason -->
		</div>
	</div>

</div>

<style>
    .radi{
        border-width: 3px;
    }
    .like-button:hover{
        animation-name: glow;
        animation-duration: .4s;
    }

    @keyframes single-pulse {
        0%, 100% {
            transform: scale(1);
            opacity: 1;
        }
        50% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
    .single-pulse {
        animation: single-pulse 0.7s linear;
    }

</style>
