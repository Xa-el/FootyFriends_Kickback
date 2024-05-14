<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores'; 
  import { doc, getDoc, getDocs, collection, query, where, orderBy } from 'firebase/firestore';
  import { db } from '$lib/firebase';
  import Post from '../../../components/Post.svelte';
  import { writable } from 'svelte/store';

  export let bio = '';
  export let displayName = '';
  export let pfpURL = '';
  export let userCity = '';
  let displayedUserID : string; 
  let postHistory = true;
  let likeHistory = false;
  let userId;
  const loadedLikes = [];

  const posts = writable([]);
  const likes = writable([]);

  async function inputLikedPost(postId, userID, postData) {
       const likesRef = collection(db, userCity, "feed", "posts", postId, "likeIds");
       const snapshot = await getDocs(likesRef);
       snapshot.forEach((doc) => {
        console.log("userId" + userID);
        console.log("postID: " + postId);
         if(userID == doc.id) {
          loadedLikes.push({
                  id: doc.id,
                  title: postData.title,
                  caption: postData.caption,
                  likes: postData.likes,
                  time: postData.time,  
                  userId: postData.u_id,
              });
         }
       });
}

  onMount(async () => {
    try {
      console.log("Fetching profile for displayName:", $page.params.display_name);
      displayName = $page.params.display_name;
      const q = query(collection(db, "users"), where("display_name", "==", displayName));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          bio = doc.data().bio;
          displayName = doc.data().display_name;
          pfpURL = doc.data().pfpURL;
          displayedUserID = doc.id;
          userCity = doc.data().City;
        } else {
          console.log("No such document!");
        }
      });

      const cityDocRef = collection(db, userCity, "feed", "posts");
      const sortedQuery = query(cityDocRef, orderBy("time", "desc")); // Adjusted query to limit the initial fetch to batchSize
      const querySnapshotPosts = await getDocs(sortedQuery);
      console.log(displayedUserID);

      const loadedPosts = [];

      querySnapshotPosts.forEach((doc) => {
        const postData = doc.data();
        console.log("Post ID:", doc.id);
        console.log("Title:", postData.title);
        console.log("Caption:", postData.caption);
        console.log("Likes:", postData.likes);
        console.log("Time:", postData.time);
        console.log("User ID:", postData.u_id);

        if (displayedUserID == postData.u_id) {
          loadedPosts.push({
            id: doc.id,
            title: postData.title,
            caption: postData.caption,
            likes: postData.likes,
            time: postData.time,  
            userId: postData.u_id,
          });
        }

        inputLikedPost(doc.id, displayedUserID, postData);
      });

      posts.set(loadedPosts);
      likes.set(loadedLikes);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  });
</script>


<div class="w-5/6 h-full ml-80 fixed">
  <h2 class="text-neon-green font-bold text-3xl mt-5 ">Profile</h2>

  <div class="flex justify-center">
    <div class="border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex flex-row">
    <img src="{pfpURL}" alt={"PFP"} class="w-48 h-48 object-fit rounded-full mt-8">
    <div class="flex flex-col justify-center ml-10">
      <p class="text-white font-bold text-4xl">{displayName}</p>
      <p class="text-white font-bold text-2xl"><span class="text-neon-green">City:</span> {userCity}</p>

     <div class="max-w-3xl flex flex-col h-full w-full overflow-hidden">
          <div class="flex-grow grow pt-1">
               <p class="text-white text-xl max-w-full h-full break-words">{bio}</p>
          </div>
     </div>

    </div>

  </div>
  
  <div class="flex items-center justify-center mt-48">
      <div class=" border-b-2 border-forest-green w-full "></div>
  </div>

  <div class="flex w-full justify-center">
    <div class="mr-16">
    <button on:click={() => { postHistory = true; likeHistory = false }}  class="font-bold text-2xl text-neon-green">Posts</button>
    </div>
    <div class="ml-16">
      <button on:click={() => { postHistory = false; likeHistory = true }} class="font-bold text-2xl text-neon-green">Likes</button>
    </div>
  </div>

  {#if postHistory}
  <div class="post-container flex-grow flex flex-col items-center overflow-y-auto h-1/2" style="white-space: pre-wrap;">
      {#each $posts as post}
          <Post {post} />
      {/each}
  </div>
  {/if}

  {#if likeHistory}
  <div class="post-container flex-grow flex flex-col items-center overflow-y-auto h-1/2" style="white-space: pre-wrap;">
      {#each $likes as post}
          <Post {post} />
      {/each}
  </div>
  {/if}

</div>
