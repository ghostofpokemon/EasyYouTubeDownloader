const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')
const express = require('express')
const sanitize = require('sanitize-filename')
const app = express()

app.use(express.json())

// Assuming this script is in the server directory, which is in the root of your project
const downloadsDir = path.join(__dirname, 'downloads')

// Make sure to create the downloads directory if it doesn't exist
if (!fs.existsSync(downloadsDir)) {
  fs.mkdirSync(downloadsDir, { recursive: true })
}

app.post('/api/download/', (req, res) => {
  console.log('Download API called with body:', req.body)
  const { url, type } = req.body

  // Enhanced validation and logging
  if (!url || typeof url !== 'string' || !url.startsWith('http')) {
    console.error(`Invalid URL provided: ${url}`)
    return res.status(400).send('Invalid URL provided')
  }
  if (!type || (type !== 'audio' && type !== 'video')) {
    console.error(`Invalid type provided: ${type}`)
    return res.status(400).send('Invalid type provided')
  }

  const command =
    type === 'audio'
      ? `yt-dlp -f 'ba' -v -x --audio-format mp3 -o "${downloadsDir}/%(title)s-%(id)s.%(ext)s" ${url}`
      : `yt-dlp -f 'ba' -v -o "${downloadsDir}/%(title)s-%(id)s.%(ext)s" ${url}`
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error in command execution: ${error}`)
      return res.status(500).send('Error in download process')
    }

    // Check for converted audio file
    let filename

    // Regex patterns for different scenarios
    const mergedVideoRegex = /\[Merger\] Merging formats into "([^"]+)"/
    const audioConversionRegex = /\[ExtractAudio\] Destination: (.+)/
    const alreadyDownloadedRegex =
      /\[download\] ([^\n]+) has already been downloaded/

    // Check for merged video file
    let match = stdout.match(mergedVideoRegex)
    if (match && match[1]) {
      filename = match[1]
    }

    // Check for converted audio file
    if (!filename) {
      match = stdout.match(audioConversionRegex)
      if (match && match[1]) {
        filename = match[1]
      }
    }

    // Check for already downloaded file
    if (!filename) {
      match = stdout.match(alreadyDownloadedRegex)
      if (match && match[1]) {
        filename = match[1]
      }
    }

    // Sending the file if exists
    if (filename && fs.existsSync(filename)) {
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + path.basename(filename)
      )
      res.download(filename)
    } else {
      console.error(
        'Could not determine the filename from stdout or file does not exist'
      )
      return res
        .status(500)
        .send('Could not determine the filename or file does not exist')
    }
  })
})
app.use((err, req, res, next) => {
  console.error(`Unhandled error: ${err.stack}`)
  res.status(500).send('Something broke!')
})

module.exports = app
