<!-- SettingsPage.svelte -->
<script lang="ts">
	import { auth } from '$lib/firebase';
	import { updatePassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import { onMount } from 'svelte';

	let newPassword: string = '';
	let confirmPassword: string = '';
	let errorMessage: string = '';
	let showError: boolean = false;

	async function handleChangePassword() {
		if (newPassword !== confirmPassword) {
			errorMessage = "Passwords do not match.";
			showError = true;
			return;
		}

		const user = auth.currentUser;
		try {
			await updatePassword(user, newPassword);
			errorMessage = "Password updated successfully.";
			showError = true;
		} catch (error) {
			errorMessage = error.message;
			showError = true;
		}
	}

	function closeErrorMessage() {
		showError = false;
	}

	onMount(() => {
		session.subscribe(($session) => {
			if (!$session.user) {
				goto('/login');
			}
		});
	});
</script>


<div class="w-5/6 h-full ml-80 fixed">
	<h2 class="text-neon-green font-bold text-3xl mt-5 ">Settings</h2>

	<div class="flex justify-center">
		<div class="border-b-2 border-forest-green w-full "></div>
	</div>

	<div class="flex items-center justify-center grow">
		<div class="border-b-2 border-neon-green pt-5 pr-8 pl-8 w-4/6">

			<div class="p-4 bg-side-green neonLine mb-3">
				<div class="centy">
					<h1 class="mb-5 text-neon-green text-center font-extrabold text-4xl">Change Password</h1>
					<form on:submit|preventDefault={handleChangePassword}>
						<input bind:value={newPassword} type="password" placeholder="New Password" class="m-2 inputButton" />
						<br>
						<input bind:value={confirmPassword} type="password" placeholder="Confirm Password" class="m-2 inputButton" />
						<br>
						<button type="submit" class="loginButt text-white font-bold">Change Password</button>
					</form>
					<div class="mt-2.5 text-center">
						<p class="text-neon-green font-bold">Forgot your password?</p>
					</div>
				</div>
			</div>
			</div>
		</div>
		<!-- <img src="{pfpURL}" alt={"PFP"} class="w-48 h-48 object-fit rounded-full mt-8">
		<div class="flex flex-col justify-center ml-10">
			<p class="text-white font-bold text-4xl">{displayName}</p>
			<p class="text-white font-bold text-2xl"><span class="text-neon-green">City:</span> {userCity}</p>

			<div class="w-full overflow-y-auto">
				<p class="text-white w-full text-xl">{bio}</p>
			</div>


		</div> -->


	</div>

	<div class="flex items-center justify-center mt-48">
		<div class=" border-b-2 border-forest-green w-full "></div>
	</div>



{#if showError}
	<div class="p-4 bg-side-green neonLine-Error mb-8">
		<div class="relative">
			<button class="close-button" on:click={closeErrorMessage}>X</button>
		</div>
		<div class="centy">
			<h1 class="text-neon-green text-center font-extrabold text-2xl">Error</h1>
			<p class="text-white text-center font-bold">{errorMessage}</p>
		</div>
	</div>
{/if}
