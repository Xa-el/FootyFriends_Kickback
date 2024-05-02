<!-- Post.svelte -->
<script lang="ts">
     import { deleteDoc, setDoc, doc, collection, getDoc, getDocs, updateDoc, increment, query } from 'firebase/firestore';
     import { db } from '$lib/firebase.js';
     import { onMount } from 'svelte';
     import { writable } from 'svelte/store';     

     let displayName = '';
     let profile_url = '';
     export let post;
     let userCity = '';
     let isLiked = false;
     let ids = [];

     const fetchUserProfile = async (userId) => {
          const docRef = doc(db, "users", userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
               displayName = docSnap.data().display_name;
               profile_url = docSnap.data().pfpURL;
               userCity = docSnap.data().City;
               setLikes(post.id);
          } else {
               console.log("No such document!");
          }
     }

     const removeLike = async (postId,likeId) => {
       try {
         await deleteDoc(doc(db, userCity, "feed", "posts", postId, "likeIds", likeId));
         console.log("Like successfully deleted!");
       } catch (error) {
         console.error("Error removing post: ", error);
       }
     };

    async function likeId(postId, userId) {
        const cityPostRef = doc(db, userCity, "feed", "posts", postId, "likeIds", userId); // Adjusted path
        try {
            // Using setDoc with merge true to create or update
            await setDoc(cityPostRef, {
                uid: userId,
            }, { merge: true });

            } catch (error) {
            console.error("Error incrementing likes: ", error);
        }

   }

     async function fetchLikes(postId) {
       const likesRef = collection(db, userCity, "feed", "posts", postId, "likeIds");
       const snapshot = await getDocs(likesRef);

       snapshot.forEach((doc) => {
         console.log("like id: " + doc.id);
         if (!ids.includes(doc.id)) {
           // If the ID does not exist, add it to the array
           ids.push(doc.id);
           console.log(ids);
         } else {
           // If the ID already exists, remove it from the array
           ids = ids.filter(id => id !== doc.id);
           console.log("ID already exists:", doc.id);
         }
       });
     }

     async function setLikes(postId) {
       const likesRef = collection(db, userCity, "feed", "posts", postId, "likeIds");
       const snapshot = await getDocs(likesRef);
       snapshot.forEach((doc) => {
         isLiked = doc.id == doc.id;
       });
     }


     let likes = writable(post.likes || 0); // Initialize with the current likes
      async function likePost(postId, userId) {
        const postRef = doc(db, userCity, "feed", "posts", postId);
        const postSnap = await getDoc(postRef);
          if (!postSnap.exists()) {
              console.log("No such document!");
          }

        fetchLikes(post.id);
        console.log("Like Ids: " + ids);
       
        try {
          if(isLiked == false){
            await updateDoc(postRef, {
                likes: increment(1),
            });
            likeId(postId, userId);
            isLiked = true;
            console.log("Is liked: " + isLiked);
            likes.update(n => n + 1);
            console.log("Likes incremented successfully");
          }
          else if(isLiked == true){
             await updateDoc(postRef, {
                likes: increment(-1),
            });
            isLiked = false;
            removeLike(postId, userId);
            likes.update(n => n - 1);
            console.log("Likes decremented successfully");              
          }
        } catch (error) {
            console.error("Error incrementing likes: ", error);
        }
    }

     onMount(() => {
          fetchUserProfile(post.userId);
     });

    function toggleLike() {
        likePost(post.id, post.userId);
    }

</script>

<div class="text-white w-5/6 max-w-5/6 flex flex-row">
     <div class="h-full w-fit flex flex-col items-center min-w-24">
          <img src={profile_url} class="radi w-16 h-16 rounded-full border-neon-green">
          <div class="flex flex-col items-center mt-2">
            <button on:click={toggleLike} class="hover:animate-pulse"> 
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class:fill-forest-green={isLiked} class:fill-dark-green={!isLiked} class="stroke-forest-green w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
               </svg>
            </button>
            <p class="text-forest-green">{$likes}</p>
          </div>
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
    .like-button:hover{
          animation-name: glow;
          animation-duration: .4s;
    }
</style>
