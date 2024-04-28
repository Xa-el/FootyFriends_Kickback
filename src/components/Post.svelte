<!-- Post.svelte -->
<script lang="ts">
     import { doc, getDoc } from 'firebase/firestore';
     import { db } from '$lib/firebase.js';
     import { onMount } from 'svelte';

     let displayName = '';
     let profile_url = '';
     export let post;
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

<div class="text-white w-5/6 max-w-5/6 flex flex-row">
     <div class="h-full w-fit flex flex-col items-center min-w-24">
          <img src={profile_url} class="radi w-16 h-16 rounded-full border-neon-green">
          <p>Likes: {post.likes}</p>
     </div>
     <div class="flex flex-col h-full w-full max-w-full overflow-hidden">
          <div class="flex flex-row items-end">
               <h1 class="text-3xl mr-1">{displayName}</h1>
               <p style="color: #9F9F9F;">{new Date(post.time).toLocaleString()}</p>
          </div>
          <div class="max-w-full grow pt-1">
               <p class="max-w-full h-full break-words">{post.caption}</p> <!-- fix this later like without the margin top it looks scuffed and there is an extra line for some reason -->
          </div>
     </div>
	
</div>


<style>
    .radi{
        border-width: 3px;
    }
</style>
