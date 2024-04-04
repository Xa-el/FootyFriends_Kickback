<script>
  import { collection, addDoc } from 'firebase/firestore';
  import { db } from '$lib/firebase'; // make sure you have a db export in your firebase.ts that refers to Firestore

  let displayName = '';
  let bio = '';

  async function addUser() {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        displayname: displayName,
        bio: bio
      });
      console.log("Document written with ID: ", docRef.id);
      // Reset fields or navigate to another page
      displayName = '';
      bio = '';
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
</script>

<form on:submit|preventDefault={addUser}>
  <input type="text" bind:value={displayName} placeholder="Display Name" />
  <textarea bind:value={bio} placeholder="Bio"></textarea>
  <button type="submit">Add User</button>
</form>

