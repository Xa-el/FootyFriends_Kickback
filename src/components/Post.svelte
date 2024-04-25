<!-- Post.svelte -->
<script>
	export let post;
	console.log("Post received:", post); // Log the received post
</script>

<div class="post text-white">
     <div class="flex items-center">
          <img src={post.profile_url} class="radi mr-[10px] w-16 h-16 rounded-full border-neon-green border-4">
          <div>
          <div class="flex items-baseline">
               <h1 class="text-3xl mr-1">{post.displayName}</h1>
               <p style="color: #9F9F9F;">{new Date(post.time).toLocaleString()}</p>
          </div>
          <p>{post.caption}</p>
          </div>
     </div>
	<p>Likes: {post.likes}</p>
</div>

<style>
    .post {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        width: 85%;
    }
    .radi{
        border-width: 3px;
    }
</style>
