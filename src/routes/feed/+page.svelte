<script lang="ts">
    import "../../app.css";
    import { onMount } from 'svelte';
    import { session } from '$lib/session.js';
    import { goto } from '$app/navigation';
    import { doc, getDoc } from 'firebase/firestore';
    import { db } from '$lib/firebase';

    let displayName = '';
    let userId;
    let userCity = '';
    let pfpURL = '';
</script>
<div class="w-2/3 h-screen bg-blue-600 flex flex-col items-end">
    <h1 class="text-white">Hello, this is our scrollable page</h1>
</div>

<div class="w-2/3 h-screen bg-red-500">
    <h1 class="text-white">This is the second page, we like feet, super smelly!</h1>

</div>

<div class="bg-side-green flex flex-col w-1/6 fixed right-0 top-0 h-screen border-forest-green border-l-4">
    <div class="flex flex-col  justify-end items-center h-24 mb-5">
        <div class="flex flex-row w-4/5 mb-4 justify-between">
            <p class="font-bold text-neon-green">Messages</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="fill-neon-green w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
</svg>

        </div>

        <input class="w-4/5 placeholder:text-sm pl-2 rounded-lg" type="text" placeholder="Search">
    </div>
    <div class=" w-full grow overflow-y-auto border-t-2 pt-3 border-neon-green">
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
