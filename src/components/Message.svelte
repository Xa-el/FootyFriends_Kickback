<!-- Message.svelte -->
<script lang="ts">
     import { doc, getDoc } from 'firebase/firestore';
     import { db } from '$lib/firebase.js';
     import { onMount } from 'svelte';

     let displayName = '';
     let profile_url = '';
     export let message;
     let post = '';
	console.log("Post received:", post);

     const fetchUserProfile = async (userId) => {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
               displayName = docSnap.data().display_name;
               profile_url = docSnap.data().pfpURL;
          } else {
               console.log("No such document!");
          }
     }

     onMount(() => {
          fetchUserProfile(post.userId);
     });
</script>

<div class="w-full h-fit flex flex-row pl-2 mb-3">
     <img src="https://pbs.twimg.com/media/F5TcRc3bAAAjD_d.jpg:large" class="w-16 min-w-16 h-16 rounded-full">
     <div class="flex flex-col h-full grow pl-2">
          <h1 class="w-full text-sm text-white">NJHanni</h1>
          <p class="w-full text-gray-500 text-sm">Super shy super shy but wait a minute while...</p>
     </div>
</div>

