<!-- Post.svelte -->
<script>
	export let post;
	console.log("Post received:", post); // Log the received post
</script>

<div class="post text-neon-green">
	<h1>{post.displayName}</h1>
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