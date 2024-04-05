<script lang="ts">
    import { collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '$lib/firebase'; // Adjust path as necessary
    let displayNameSearch = '';
    let searchResult = '';
  
    async function searchByDisplayName() {
      const usersCol = collection(db, "users", "userId", "userProfile", "profileInfo");
      
      console.log("user cols:: " + usersCol);
      console.log("display name search: " + displayNameSearch);
      const q = query(usersCol, where("display_name", "==", displayNameSearch));
  
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Assuming display names are unique, or just taking the first result
        const userDoc = querySnapshot.docs[0];
        searchResult = `Found user ID: ${userDoc.id}`;
        // Optionally, do something with userDoc.data() or userDoc.id here
      } else {
        console.log("Nothing found");
        searchResult = "No user found with that display name.";
      }
    }
  </script>
  
  <input type="text" bind:value={displayNameSearch} placeholder="Search by Display Name">
  <button on:click={searchByDisplayName}>Search</button>
  
  <p>{searchResult}</p>
  