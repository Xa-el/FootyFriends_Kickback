<script lang="ts">
    import { doc, collection, query, where, getDocs } from 'firebase/firestore';
    import { db } from '$lib/firebase'; // Adjust path as necessary
    import { goto} from '$app/navigation';
    let displayNameSearch = '';
    let searchResult = '';



    async function getUsers() {
	    const usersCol = collection(db, 'users');
	    const querySnapshot = await getDocs(usersCol);
	    querySnapshot.forEach((doc) => {
			    console.log(doc.id, ' => ', doc.data());
			    // Here you can access each document's data and perform further operations
			    });
    }

 
    async function searchByDisplayName() {
     

      const usersCol = collection(db, 'users');
      const querySnapshot = await getDocs(usersCol);
  
      if (!querySnapshot.empty) {
	querySnapshot.forEach((doc) => {
			const userData = doc.data();
			const userId = doc.id;
			const displayName = userData.display_name;

			if(displayNameSearch == displayName) {
				searchResult = doc.id; 
                    goto(`/profile/${searchResult}`);
			}
	})


      } else {
        console.log("Nothing found");
        searchResult = "No user found with that display name.";
      }
    }


  </script>
  
  <input type="text" bind:value={displayNameSearch} placeholder="Search by Display Name">
  <button on:click={searchByDisplayName}>Search</button>
  
  <p>{searchResult}</p>
  
