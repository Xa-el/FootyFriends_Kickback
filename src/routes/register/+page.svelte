<script lang="ts">
  import { auth } from '$lib/firebase';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import { session } from '$lib/session';
  import { onMount } from 'svelte';
  import {
    GoogleAuthProvider,
    signInWithPopup,
  } from 'firebase/auth';

  let errorMessage: string = '';
  let showError: boolean = false;

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

        goto('/register/info');
      })
      .catch((error) => {
        return error;
      });
  }

  function closeErrorMessage() {
    showError = false;
  }
  function goToLogin(){
    goto('/login');
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
        goto('/register/info');
      })
      .catch((error) => {
        errorMessage = "User with that email already exists or password is less than 6 characters";
        showError = true;
      });
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

  .neonLine-Error{
    outline: 1px solid #6A863D; /* Sets width, style, and color */
    border-radius: 10px;
    width: 650px; /* Sets the width of the main container */
    height: 100px; /* Sets the height of the main container */
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
  .close-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    cursor: pointer;
    color: white;
    font-size: 1.5rem;
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


<div class="flex items-center justify-center overflow-hidden h-[calc(100vh-60px)]">
  <div>
    {#if showError}
      <div class="p-4 bg-side-green neonLine-Error mb-8">
        <div class="relative">
          <button class="close-button" on:click={closeErrorMessage}>X</button>
        </div>
        <div class="centy">
          <h1 class="text-neon-green text-center font-extrabold text-2xl">ERROR</h1>
          <p class="text-white text-center font-bold">{errorMessage}</p>
        </div>
      </div>
    {/if}

    <div class="p-4 bg-side-green neonLine">
      <div class="centy">
        <h1 class="mb-5 text-neon-green text-center font-extrabold text-4xl">Register On KICKBACK</h1>
        <form on:submit={handleRegister}>
          <input class="m-2 inputButton"bind:value={email} type="text" placeholder="Email" />
          <br>
          <input class="m-2 inputButton"bind:value={password} type="password" placeholder="Password" />
          <br>
          <button class="loginButt text-white font-bold" type="submit">Register</button>
        </form>
        <p class=" mt-2.5 text-neon-green font-bold">Forgot Account?</p>
        <div>or</div>
      </div>
      <div class="newActions font-bold">
        <button class="createButton text-dark-green" on:click={loginWithGoogle}>Register with Google</button>
        <button class="createButton text-dark-green" on:click={goToLogin}>Already a user? Login!</button>
      </div>
    </div>
    <div class = "textbox">
    </div>
  </div>
</div>



