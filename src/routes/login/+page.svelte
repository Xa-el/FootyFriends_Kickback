<script lang="ts">
	import { session } from '$lib/session';
	import { auth } from '$lib/firebase';
    import { onMount } from 'svelte';
	import {
		GoogleAuthProvider,
		signInWithPopup,
		signInWithEmailAndPassword,
		type UserCredential
	} from 'firebase/auth';
	import { goto } from '$app/navigation';

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

    onMount(async () => {
    session.subscribe(($session) => {
      if ($session.user) {
        goto('/');
      }
    });
  });

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
        width: 375px; /* Sets the width of the button */
        height: 50px; /* Sets the height of the button */
        font-size: 18px; /* Adjust this based on your preference */
         padding: 0 15px; /* Horizontal padding, vertical padding is not necessary due to height setting */
        text-align: left;
        line-height: 50px; /* This helps center the text vertically */
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
        width: 230px;
        height: 50px;
        background: #002615;
        font-size: 30px;
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
        width: 230px;
        height: 50px;
        font-size: 20px;
    }
    .header {
        display: flex;
        justify-content: space-between;
        padding: 10px 20px;
        align-items: center;
        color: #C3F53C; /* Neon green text */
        background: #013A21;
    }
    .header .logo {
        cursor: pointer;
        font-size: 24px;
        font-weight: bold;
    }

</style>

<div class="header border-b-2 border-forest-green flex justify-between items-center w-full h-15">
     <div class="flex flex-row">
          <div class="logo flex flex-row" on:click={() => goto('/')}>
               <img src="/logo.png" alt="KICKBACK Logo" />
               <h1 class="ml-2 font-bold">KICKBACK</h1>
          </div>
     </div>
</div>

<div class="flex items-center justify-center h-[calc(100vh-60px)]">
    <div class="p-4 bg-side-green neonLine">
      <div class="centy">
        <h1 class="text-neon-green text-center font-extrabold text-4xl">Log Into KICKBACK</h1>
        <form on:submit={loginWithMail}>
            <input class="m-2 inputButton"bind:value={email} type="text" placeholder="Email" />
            <br>
            <input class="m-2 inputButton"bind:value={password} type="password" placeholder="Password" />
            <br>
            <button class="loginButt text-white font-bold" type="submit">Log In</button>
        </form>
        <a href="/login/forgot" on:click|preventDefault={() => goto('/login/forgot')}>
          <p class="text-neon-green font-bold">Forgot Account?</p>
        </a>
        <div class="flex justify-center">
            <!-- <div class="border-b-2 border-black w-17/20 mt-4"></div> -->
            <!-- that just doesnt owrk for some reason ^^ -->
            or
            <!-- <div class="border-b-2 border-black w-17/20 mt-4"></div> -->
        </div>
     </div>
          <div class="newActions font-bold">
               <button class="createButton text-dark-green" on:click={loginWithGoogle}>Login with Google</button>
               <button class="createButton text-dark-green"on:click={registerAccount}>Create new Account</button>
          </div>
    </div>
    <div class = "textbox">
    </div>
</div>


