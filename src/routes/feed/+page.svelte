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

<div class="bg-side-green w-1/6 fixed right-0 top-0 h-screen border-forest-green border-l-4"></div>