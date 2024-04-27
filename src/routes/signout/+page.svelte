<script>
  import { getAuth, signOut } from 'firebase/auth';

  // Initialize Firebase auth
  const auth = getAuth();

  function handleSignOut() {
    signOut(auth).then(() => {
      console.log('Signed Out');
      // Optionally, redirect the user or update the UI state here
    }).catch((error) => {
      console.error('Sign Out Error', error);
    });
  }
</script>

<button on:click="{handleSignOut}">Sign Out</button>

