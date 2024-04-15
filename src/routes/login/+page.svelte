<script lang="ts">
	import { session } from '$lib/session';
	import { auth, db } from '$lib/firebase';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		signInWithEmailAndPassword,
		type UserCredential
	} from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { doc, getDoc } from 'firebase/firestore';

	let email: string = '';
	let password: string = '';

	async function loginWithMail() {
		await signInWithEmailAndPassword(auth, email, password)
			.then((result) => {
				const { user }: UserCredential = result;
				session.set({
					loggedIn: true,
					user: {
						displayName: user?.displayName,
						email: user?.email,
						uid: user?.uid
					}
				});
				goto('/');
			})
			.catch((error) => {
				return error;
			});
	}

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
	async function registerAccount() {
		goto('/register');

	}
</script>

<style>
    .full-height {
        height: 100vh; /* This ensures the parent div takes the full height */
    }
    .neonLine{
        outline: 1px solid #6A863D; /* Sets width, style, and color */
        border-radius: 10px;
        width: 650px; /* Sets the width of the main container */
        height: 450px; /* Sets the height of the main container */        
    }
    .inputButton{
        outline: 2px solid #6A863D;
        border-radius: 5px;
        background: #002615;
        color: white;
        border: none;
    }
    .centy{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    form{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }

    .loginButt{
        border: none;
        border-radius: 5px;
        background: #002615;
    }

    .newActions{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        margin-top: 20px;
    }
    .createButton{
        border: none;
        background: #C3F53C;
        border-radius: 5px;

    }
</style>

<div class="flex items-center justify-center full-height">
    <div class="p-4 bg-forest-green neonLine">
      <div class="centy">
        <h1 class="text-neon-green text-center font-extrabold text-4xl">Login</h1>
        <form on:submit={loginWithMail}>
            <input class="m-2 inputButton"bind:value={email} type="text" placeholder="Email" />
            <br>
            <input class="m-2 inputButton"bind:value={password} type="password" placeholder="Password" />
            <br>
            <button class="loginButt text-white" type="submit">Login</button>
        </form>
        <p class="text-neon-green">Forgot Account?</p>
        <div>or</div>
     </div>
          <div class="newActions">
               <button class="createButton text-dark-green" on:click={loginWithGoogle}>Login with Google</button>
               <button class="createButton text-dark-green"on:click={registerAccount}>Create new Account</button>
          </div>
    </div>
</div>


