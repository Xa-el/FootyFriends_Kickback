<script lang="ts">
  import { onMount } from 'svelte';
  import { db } from '$lib/firebase';
  import { collection, doc, getDoc, getDocs, orderBy, query,} from 'firebase/firestore'; // Note: Using setDoc now
  import { session } from '$lib/session';
  import { goto } from '$app/navigation';
  import Post from '../../components/Post.svelte';
  import { writable } from 'svelte/store';

  import "../../app.css";

  let bio = '';
  let displayName = '';
  let userId;
  let pfpURL = '';
  let userCity = '';
  let postHistory = true;
  let likeHistory = false;
  const loadedLikes = [];


  const posts = writable([]);
  const likes = writable([]);

  // Fetch user profile information
  const fetchUserProfile = async (userId) => {
    // Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
    const docRef = doc(db, "users", userId); // Adjusted path
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      bio = docSnap.data().bio;
      displayName = docSnap.data().display_name;
      pfpURL = docSnap.data().pfpURL;
      userCity = docSnap.data().City;

    } else {
      console.log("No such document!");
    }
  };

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



  // On component mount, fetch the user profile
  onMount(async () => {
    session.subscribe(async ($session) => {
      if ($session.user) {
        userId = $session.user.uid;
        await fetchUserProfile(userId); // Fetch user profile and get the user's city
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

            
            inputLikedPost(doc.id, userId, postData);

        });
          posts.set(loadedPosts);
          likes.set(loadedLikes);
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

      <div class="w-full overflow-y-auto">
        <p class="text-white w-full text-xl">{bio}</p>
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