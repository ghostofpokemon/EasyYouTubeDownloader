<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-zomp p-4">
    <h1 class="text-6xl font-bold mb-8 text-misty-rose">
      download youtube
    </h1>
    <div class="mb-8">
      <input
        v-model="videoUrl"
        type="text"
        placeholder="Paste URL here..."
        class="px-4 py-2 w-80 border-2 border-black-bean rounded text-black-bean placeholder-black-bean"
      >
    </div>
    <div class="space-x-4 mb-8">
      <button
        class="bg-electric-blue text-moonstone px-6 py-2 rounded shadow hover:bg-moonstone"
        :disabled="loading"
        @click="download('audio')"
      >
        {{ loading ? "Loading..." : "🎧 MP3" }}
      </button>
      <button
        class="bg-misty-rose text-black-bean px-6 py-2 rounded shadow hover:bg-moonstone"
        :disabled="loading"
        @click="download('video')"
      >
        {{ loading ? "Loading..." : "🎥 Video" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      videoUrl: '',
      loading: false // Added a loading state
    }
  },
  methods: {
    async download (type) {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!this.videoUrl || !urlTegex.test(this.videoUrl) || !['audio', 'video'].includes(type)) {
        console.error('Invalid video URL or type')
        return
      }
      this.loading = true
      try {
        const response = await this.$axios.post('/api/download/', {
          url: this.videoUrl.trim(),
          type
        }, {
          responseType: 'blob' // Important for handling binary data
        })

        if (response.data.type === 'text/html') {
          throw new Error('Server returned an HTML response. Check server logs for errors.')
        }

        const blob = new Blob([response.data], { type: response.data.type }) // Create blob from response.data
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        const contentDisposition = response.headers['content-disposition'] || ''
        const filename = contentDisposition.split('filename=')[1] || 'download' // Extract filename from response headers
        link.download = filename
        document.body.appendChild(link)
        link.click()
        window.URL.revokeObjectURL(downloadUrl) // Clean up
        document.body.removeChild(link)
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
/* Add your component-specific styles here */
</style>
