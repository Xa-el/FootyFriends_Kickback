<script lang="ts">
    import "../../app.css";
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
    let profile_url = '';
    let userCity = '';
    let title = '';
    let likesPost = 0;
    let postCaption = '';

    /* Need to find a way to just import this from the layout */
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

    async function createPost() {
        console.log("post called");
        if(postCaption == ""){
            console.log("No caption inputed");
            return;
        }
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
            pfpURL : profile_url,
    		}, { merge: true });

    		console.log("Post created successfully");
        window.location.reload();
    	} catch (error) {
    		console.error("Error updating profile: ", error);
    	}

    }


  // Function to handle Enter key in textarea
  function handleEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) { // Check if Enter key is pressed, ignoring if Shift is held (for new lines)
      event.preventDefault(); // Prevent the default action to avoid a newline in textarea
      kickBall();
      createPost(); // Call the function to create the post
    }
  }

    /* Not sure if we can just add some of this into the layout, need to talk about this */
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
                        console.log("Profile URL:", postData.pfpURL);

                        loadedPosts.push({
                            id: doc.id,
                            title: postData.title,
                            caption: postData.caption,
                            displayName: postData.display_name,
                            likes: postData.likes,
                            time: postData.time,
                            userId: postData.u_id,
                            profile_url: postData.pfpURL
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

  let isKicked = false;
  let cleatMove = false;

  function cleatKick(){
    cleatMove = !cleatMove;
  }

  function kickBall() {
    cleatMove = !cleatMove;
    isKicked = true;

    setTimeout(() => {
      isKicked = false; // reset after animation
      cleatMove = false;
    }, 1000); // match the duration of the CSS animation
  }

</script>

<style>
    .post-container {
        /*display: grid;*/
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
    textarea {
        resize: none;
    }
    .input-container {
        display: flex;
        align-items: flex-start; /* Align items at the start */
    }
    .submit-button {
        margin-left: 10px; /* Adjust margin as needed */
    }

    .ball {
         width: 50px;
         height: 50px;
         border-radius: 100%;
         position: relative;
         transition: transform 0.5s ease;
     }

     .foot {
         width: 50px;
         height: 50px;
         position: absolute;
         left: -65px;  /* Position the foot relative to the ball  */
         bottom: 1px;
         transform: rotate(30deg);
         transform-origin: top right;
         transition: transform 0.15s ease;
     } 

     .foot.kicked {
          transform: rotate(-45deg);
     }


     .kick {
         transform: translateX(300px) translateY(-100px);
         transition: transform 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67);
     }    
</style>


<div class="w-2/3 bg-forest-green-600 flex flex-col h-2/3 items-center">
    <div class="input-container h-full mt-5 mb-5 w-5/6 border-b-2 border-b-forest-green ">
        <div class="mr-2">
            <img src={profile_url} alt={"PFP"} style="border-width: 3px;" class="w-16 h-16 mb-5 rounded-full border-neon-green">
        </div>
        <div class="flex items-center w-5/6 text-2xl">
            <textarea id="postInput" class="text-neon-green outline-none py-2 flex-grow w-full " bind:value={postCaption} on:keydown={handleEnter} style="background-color: transparent; " placeholder="Write your post here..."></textarea>
        </div>
        <div class="text-center justify-center py-2">

        <button type="button" style="transition-timing-function: ease;" on:click={kickBall} on:click={createPost}>
            <div class="flex flex-row-reverse"> 
                <div class="ball">
                    <img src="https://cdn.discordapp.com/attachments/1224952780838539346/1232911069698195477/6702498.png?ex=662b2d69&is=6629dbe9&hm=de74361ce8760fc65e5fa216d57902c7f2a3eac90336b579ccace4a83ee66532&" alt="foot" class="foot {cleatMove ? 'kicked' : ''}">
                    <img src="https://cdn.discordapp.com/attachments/1224952780838539346/1232897640476180562/soccer2.png?ex=662b20e7&is=6629cf67&hm=cf356b5334643f31b4733fd22a03d830c86456d3a3a212ef46b571654b4a1b9b&" alt="Soccer Ball" style="width: 100%; height: auto;" class:kick={isKicked}>
                </div>  

                <div class="w-20"></div>
            </div>
        </button>  

        

        </div>  
    </div>
</div>


<div class="w-2/3 h-screen bg-forest-green-500 flex flex-col">
    <div class="post-container flex-grow flex flex-col items-center">
        {#each $posts as post}
            <Post {post} />
        {/each}
    </div>
</div>

<div class="bg-side-green flex flex-col w-1/6 fixed right-0 top-0 h-screen border-forest-green border-l-4">
    <div class="flex flex-col  justify-end items-center h-20 mb-5">
        <div class="flex flex-row w-4/5 mb-2 justify-between">
            <p class="font-bold text-neon-green">Messages</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="fill-neon-green w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

        </div>

        <input class="w-4/5 placeholder:text-sm pl-2 rounded-lg" type="text" placeholder="Search">
    </div>
    <div class=" w-full grow overflow-y-auto pt-1">
        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>

        <div class="w-full h-fit flex flex-row pl-2 mb-3">
            <div class="w-16 rounded-full bg-black"></div>
            <div class="flex flex-col h-full grow pl-2">
                <h1 class="w-full text-sm text-white">John Smith</h1>
                <p class="w-full text-gray-500 text-sm">Hey, I think you have cute feet!</p>
            </div>
        </div>
        
    </div>
</div>
