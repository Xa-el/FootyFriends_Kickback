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

<div class="post text-white">
     <div class="flex items-center">
          <img src={profile_url} class="radi mr-[10px] w-16 h-16 rounded-full border-neon-green border-4">
          <div>
          <div class="flex items-baseline">
               <h1 class="text-3xl mr-1">{displayName}</h1>
               <p style="color: #9F9F9F;">{new Date(post.time).toLocaleString()}</p>
          </div>
          <p>{post.caption}</p>
          </div>
     </div>
	<p>Likes: {post.likes}</p>
</div>

<style>
    .post {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        width: 85%;
    }
    .radi{
        border-width: 3px;
    }
</style>
