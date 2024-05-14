<script>
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'l0gwscnc');

    try {
      // Direct upload to Cloudinary's API
      const response = await fetch('https://api.cloudinary.com/v1_1/dong0qhly/image/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Uploaded Image URL:', data.secure_url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }
</script>

<input type="file" on:change="{handleUpload}" />


