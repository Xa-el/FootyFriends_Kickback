<script lang="ts">
    import { supabase } from '$lib/supabase';
    
    let bioText = '';
    
    async function uploadBio() {
      if (!bioText) {
        console.error('Bio is empty');
        return;
      }
    
      const fileName = `bio_${Date.now()}.txt`; // Unique filename based on timestamp
      const fileContent = new Blob([bioText], { type: 'text/plain' });
    
      const { data, error } = await supabase.storage
        .from('bio')
        .upload(fileName, fileContent);
    
      if (error) {
        console.error('Upload error', error);
        return;
      }
    
      console.log('Bio uploaded', data);
    }
</script>
    
<textarea bind:value={bioText} placeholder="Write your bio here..."></textarea>
<button on:click={uploadBio}>Upload Bio</button>
    
    

<h1>Welcome to Home page</h1>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
