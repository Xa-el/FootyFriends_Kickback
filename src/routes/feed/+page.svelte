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
            <p>[]</p>
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
