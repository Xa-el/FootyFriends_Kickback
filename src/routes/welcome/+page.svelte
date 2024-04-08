<script lang="ts">
     import type { User } from '$lib/session';


     let user : User;
</script>

<svelte:head>
     <title>My name is {user.displayName}</title>
</svelte:head>

<h1>Welcome, {user.displayName}!</h1>
