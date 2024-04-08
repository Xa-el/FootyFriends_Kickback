<script lang="ts">
    import { doc, collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '$lib/firebase'; // Adjust path as necessary
    let displayNameSearch = '';
    let searchResult = '';



    async function getUsers() {
	    const usersCol = collection(db, 'users');
//	    const docRef = doc(db, "users", userId, "userProfile", "profileInfo"); // Adjusted path
	    const querySnapshot = await getDocs(usersCol);
	    querySnapshot.forEach((doc) => {
			    console.log(doc.id, ' => ', doc.data());
			    // Here you can access each document's data and perform further operations
			    });
    }

/* 
    async function searchByDisplayName() {
      
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

    */
  </script>
  
  <input type="text" bind:value={displayNameSearch} placeholder="Search by Display Name">
  <button on:click={getUsers}>Search</button>
  
  <p>{searchResult}</p>
  
