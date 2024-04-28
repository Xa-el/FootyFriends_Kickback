<script lang="ts">
	import "../app.css";
	import { onMount } from 'svelte';
	import { session } from '$lib/session.js';
	import { goto } from '$app/navigation';
	import { doc, getDoc } from 'firebase/firestore';
	import { db } from '$lib/firebase';
	import { page } from '$app/stores';

	let displayName = '';
	let userId;
	let userCity = '';
	let pfpURL = '';
	let currentPath = '';
	let loggedINNN = false;
	import type { LayoutData } from './$types';
	export let data: LayoutData;

	let loading: boolean = true;
	let loggedIn: boolean = false;

	session.subscribe((cur: any) => {
		loading = cur?.loading;
		loggedIn = cur?.loggedIn;
	});

	onMount(async () => {
		const user: any = await data.getAuthUser();

		const loggedIn = !!user && user?.emailVerified;
		session.update((cur: any) => {
			loading = false;
			return {
				...cur,
				user,
				loggedIn,
				loading: false
			};
		});

		if (loggedIn) {
			// goto('/');
		}
	});

	const fetchUserProfile = async (userId) => {
		// Assuming a specific doc ID or using a known doc ID here. Adjust as needed.
		const docRef = doc(db, "users", userId); // Adjusted path
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			displayName = docSnap.data().display_name;
			pfpURL = docSnap.data().pfpURL;
			userCity = docSnap.data().City;
			console.log("Display Name: " + displayName + "PFP URL: " + pfpURL);
		} else {
			console.log("No such document!");
		}
	};

	onMount(() => {
		session.subscribe(($session) => {
			if ($session.user) {
				userId = $session.user.uid;
				loggedINNN = true;
				fetchUserProfile(userId);
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

		currentPath = window.location.pathname;
	});



</script>

{#if loggedINNN}
<div class='bg-side-green w-1/6 border-forest-green border-r-4 fixed left-0 top-0 h-screen'>
	<!--Big div-->
	<div>
		<!-- Title (top half no buttons) -->
		<div class = "flex flex-row justify-center items-center mr-4">
			<!-- logo + name -->
			<img src="logo.png" alt={"Logo"} class="m-1 size-9">
			<p class=" text-neon-green text-4xl text-center font-bold">KICKBACK</p>
		</div>

		<div>
			<!-- pfp + name + loc -->
			<div class="flex flex-col items-center">
				<!-- Profile Picture -->
				<img src={pfpURL} alt={"PFP"} class="w-20 h-20 object-fit rounded-full mt-4">

				<div>
					<!-- Username -->
					<h2 class="text-white text-center md:text-base lg:text-lg xl:text-2xl font-semibold">{displayName}</h2>
					<!-- Location -->
					<p class="text-neon-green font-bold text-lg text-center">{userCity}</p>
				</div>
			</div>
		</div>

		<div class="flex mt-17 justify-center items-center">
			<!-- Spacer -->
			<div class="flex-none w-1/3"></div>

			<!-- Favorites -->
			<div class="flex flex-row space-x-9 items-center">
				<!-- league -->
				<div class="flex flex-col items-center">
					<img src="https://b.fssta.com/uploads/application/soccer/competition-logos/EnglishPremierLeague.png" alt="league" class="w-10 h-10 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-base text-center">League</p>
				</div>

				<!-- club -->
				<div class="flex flex-col items-center">
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" alt="club" class="w-10 h-10 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-base text-center">Club</p>
				</div>

				<!-- GOAT -->
				<div class="flex flex-col items-center">
					<img src="https://b.fssta.com/uploads/application/soccer/headshots/66617.png" alt="goat" class="w-10 h-10 mt-4 object-cover">
					<p class="text-white text-sm md:text-base lg:text-base xl:text-base text-center">GOAT</p>
				</div>
			</div>

			<!-- Spacer -->
			<div class="flex-none w-1/3"></div>
		</div>

		<div class="flex justify-center">
			<div class="border-b-2 border-forest-green w-17/20 mt-4"></div>
		</div>

		<div class="flex mt-17 justify-center items-center">
			<!-- Spacer -->
			<div class="flex-none w-1/3"></div>

			<!-- Buttons -->
			<div class="flex flex-col items-left mt-4 space-y-4">
				<!-- Feed -->
				<button class="justify-start bg-side-green hover:ring-2 hover:ring-forest-green text-white font-semibold py-1 pl-2 pr-36 rounded-full inline-flex items-left {$page.url.pathname.includes('/') ? 'ring-2 ring-forest-green shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-forest-green w-6 h-6 mr-2">
						<path fill-rule="evenodd" d="M4.804 21.644A6.707 6.707 0 0 0 6 21.75a6.721 6.721 0 0 0 3.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 0 1-.814 1.686.75.75 0 0 0 .44 1.223ZM8.25 10.875a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25ZM10.875 12a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
					</svg>
					<span>Feed</span>
				</button>

				<!-- Teams -->
				<button class="justify-start hover:shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px] hover:ring-2 hover:ring-forest-green text-white font-semibold py-1 pl-2 pr-34 rounded-full inline-flex items-left {$page.url.pathname.includes('/teams') ? 'ring-2 ring-forest-green shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]' : ''}">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-forest-green w-6 h-6 mr-2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
					</svg>
					<span>Teams</span>
				</button>

				<!-- Events -->
				<button class="justify-start hover:ring-2 hover:ring-forest-green text-white font-semibold py-1 pl-2 pr-34 rounded-full inline-flex items-left">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-forest-green w-6 h-6 mr-2">
						<path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
						<path fill-rule="evenodd" d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z" clip-rule="evenodd" />
					</svg>

					<span>Events</span>
				</button>

				<!-- Settings -->
				<button class="justify-start hover:ring-2 hover:ring-forest-green text-white font-semibold py-1 pl-2 pr-34 rounded-full inline-flex items-left">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fill-forest-green w-6 h-6 mr-2">
						<path fill-rule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 0 0-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 0 0-2.282.819l-.922 1.597a1.875 1.875 0 0 0 .432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 0 0 0 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 0 0-.432 2.385l.922 1.597a1.875 1.875 0 0 0 2.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 0 0 2.28-.819l.923-1.597a1.875 1.875 0 0 0-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 0 0 0-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 0 0-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 0 0-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 0 0-1.85-1.567h-1.843ZM12 15.75a3.75 3.75 0 1 0 0-7.5 3.75 3.75 0 0 0 0 7.5Z" clip-rule="evenodd" />
					</svg>

					<span>Settings</span>
				</button>
			</div>

			<!-- Spacer -->
			<div class="flex-none w-1/3"></div>
		</div>

		<div class="flex justify-center">
			<div class="border-b-2 border-forest-green w-17/20 mt-4"></div>
		</div>

		<div class="flex flex-col justify-center">
			<div>
				<!--Title-->
				<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center mt-4">Trending Scores</p>
			</div>

			<div class="flex flex-row items-center justify-center space-x-8 mt-2">
				<!--Game 1-->
				<div class="flex">
					<!--Home-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/Chelsea_FC.svg/1200px-Chelsea_FC.svg.png" alt="home1" class="w-14 h-14 object-cover">
				</div>

				<div class="flex flex-col items-center justify-center">
					<!--Match Info-->
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center mt-4">VS</p>
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center">5 - 0</p>
				</div>

				<div class="flex">
					<!--Away-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" alt="away1" class="w-14 h-14 object-cover">
				</div>

			</div>

			<div class="flex flex-row items-center justify-center space-x-8 mt-5">
				<!--Game 2-->
				<div class="flex">
					<!--Home-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Inter_Miami_CF_logo.svg/1200px-Inter_Miami_CF_logo.svg.png" alt="home1" class="w-14 h-14">
				</div>

				<div class="flex flex-col items-center justify-center">
					<!--Match Info-->
					<p class="text-red-600 font-bold text-sm md:text-base lg:text-base xl:text-base text-center">Live</p>
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center">5 - 0</p>
				</div>

				<div class="flex">
					<!--Away-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b5/St._Louis_City_SC_logo.svg/1200px-St._Louis_City_SC_logo.svg.png" alt="away1" class="w-14 h-14">
				</div>

			</div>

			<div class="flex flex-row items-center justify-center space-x-8 mt-5">
				<!--Game 3-->
				<div class="flex">
					<!--Home-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Tottenham_Hotspur.svg/1200px-Tottenham_Hotspur.svg.png" alt="home1" class="w-14 h-14">
				</div>

				<div class="flex flex-col items-center justify-center">
					<!--Match Info-->
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center mt-4">VS</p>
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center">5 - 0</p>
				</div>

				<div class="flex">
					<!--Away-->
					<img src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Liverpool_FC.svg/1200px-Liverpool_FC.svg.png" alt="away1" class="w-14 h-14">
				</div>

			</div>

		</div>

	</div>

</div>
{/if}


<!-- <div class="bg-pink-500 w-1/6 fixed right-0 top-0 h-screen"></div> -->


<div class="flex flex-col items-center">
	<slot></slot>
</div>
