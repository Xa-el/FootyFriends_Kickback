<script lang="ts">
    import "../app.css";
    import { onMount } from 'svelte';
    import { session } from '$lib/session.js';
    import { goto } from '$app/navigation';
    import type { LayoutData } from './$types';

    let loggedIn : boolean;

    session.subscribe((cur: any) => {
        loggedIn = cur?.loggedIn;
    });

    export let data: LayoutData;
    onMount(async () => {
        const user: any = await data.getAuthUser();

        if (!loggedIn) {
            goto('/login');
        } else {goto('/');}
    });
</script>

<div class='bg-side-green w-1/5 h-screen border-forest-green border-r-4'>
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
                <img src="https://cdn.pfps.gg/pfps/9795-gojo.png" alt={"PFP"} class="size-3/10 rounded-full mt-4">
                
                <div>
                    <!-- Username -->
                    <h2 class="text-white text-bold text-center md:text-base lg:text-lg xl:text-2xl font-semibold">GojoSatoru</h2>
                    <!-- Location -->
                    <p class="text-neon-green text-bold text-lg text-center">Gainesville, FL</p>
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
                    <img src="https://b.fssta.com/uploads/application/soccer/competition-logos/EnglishPremierLeague.png" alt="PFP" class="w-10 h-10 mt-4 object-cover">
                    <p class="text-white text-sm md:text-base lg:text-base xl:text-base text-center">League</p>
                </div>
            
                <!-- club -->
                <div class="flex flex-col items-center">
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/1200px-Real_Madrid_CF.svg.png" alt="PFP" class="w-10 h-10 mt-4 object-cover">
                    <p class="text-white text-sm md:text-base lg:text-base xl:text-base text-center">Club</p>
                </div>
            
                <!-- GOAT -->
                <div class="flex flex-col items-center">
                    <img src="https://b.fssta.com/uploads/application/soccer/headshots/66617.png" alt="PFP" class="w-10 h-10 mt-4 object-cover">
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
            <div class="flex flex-col items-center mt-4 space-y-4">
                <!-- Feed -->
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Button
                </button>
            
                <!-- Events -->
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Button
                </button>
            
                <!-- Settings -->
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Button
                </button>
            </div>
            
            <!-- Spacer -->
            <div class="flex-none w-1/3"></div>
        </div>

    </div>

</div>
