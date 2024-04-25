<!-- Post.svelte -->
<script>
	export let post;
	console.log("Post received:", post); // Log the received post
</script>

<div class="post text-white">
	<h1 class="text-3xl">{post.displayName}</h1>
     <img src={post.profile_url} class="size-1/3 mb-5 rounded-full border-neon-green border-4">
	<p>{post.caption}</p>
	<p>Likes: {post.likes}</p>
	<p>Time: {new Date(post.time).toLocaleString()}</p>
</div>

<style>
    .post {
        border: 1px solid #ccc;
        padding: 20px;
        border-radius: 8px;
        width: 85%;
    }
</style>
