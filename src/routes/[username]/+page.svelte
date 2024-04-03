<script lang="ts">
     import type { Person } from './$types';

     export let data: Person;
</script>

<svelte:head>
     <title>My name is {data.name}</title>
     <meta name="description" content={data.name} />
</svelte:head>

<h1>Welcome, {data.name}!</h1>
