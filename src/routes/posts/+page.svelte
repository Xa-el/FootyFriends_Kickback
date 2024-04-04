<script lang="ts">
  export let profile: { bio: string; display_name: string };

  // If the profile could potentially be null, make sure to handle that case in your markup.
</script>

{#if profile}
  <h2>User Profile</h2>
  <div class="user-profile">
    <div><strong>Display Name:</strong> {profile.display_name}</div>
    <div><strong>Bio:</strong> {profile.bio}</div>
  </div>
{:else}
  <p>User profile not found.</p>
{/if}

