<script lang="ts">
	import { auth } from '$lib/firebase';
	import { createUserWithEmailAndPassword } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { session } from '$lib/session';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		signInWithEmailAndPassword,
		type UserCredential
	} from 'firebase/auth';
	async function loginWithGoogle() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider)
			.then((result) => {
				const { displayName, email, uid } = result?.user;
				session.set({
					loggedIn: true,
					user: {
						displayName,
						email,
						uid
					}
				});

				goto('/');
			})
			.catch((error) => {
				return error;
			});
	}



	let email: string = '';
	let password: string = '';

	async function handleRegister() {
		await createUserWithEmailAndPassword(auth, email, password)
			.then((result) => {
				const { user } = result;
				session.update((cur: any) => {
					return {
						...cur,
						user,
						loggedIn: true,
						loading: false
					};
				});
				goto('/');
			})
			.catch((error) => {
				throw new Error(error);
			});
	}




</script>

<div class="register-form">
	<form on:submit={handleRegister}>
		<h2>Register</h2>
		<input bind:value={email} type="text" placeholder="Email" />
		<input bind:value={password} type="password" placeholder="Password" />
		<button type="submit">Register</button>
	</form>
     <button on:click={loginWithGoogle}>Register with Google</button>
</div>
