const { Client, MessageMedia } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')
const fs = require('fs')
const path = require('path')

// Initialize the client
const client = new Client({
  webVersionCache: {
    type: 'none',
    // remotePath:
    //   'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
  },
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

// Confirm when authenticated
client.on('ready', async () => {
  console.log('Client is ready!')

  const numbers = [] // Add no. in string without '-' and space

  const imagePath = path.resolve(__dirname, 'motivation.png') // Path to your image file
  const pdfPath = path.resolve(__dirname, 'demo.pdf') // Path to your PDF file
  const message = `Hello!\n\nhttps://www.youtube.com/watch?v=y9gIg2MwIRg&ab_channel=TheAthElite`

  let successCount = 0
  let failureCount = 0
  const failedNumbers = []

  const checkCompletion = () => {
    if (successCount + failureCount === numbers.length) {
      console.log(
        `Messages sent successfully: ${successCount}/${numbers.length}`
      )
      if (failedNumbers.length > 0) {
        console.log(`Failed Numbers: ${failedNumbers}`)
      }
    }
  }

  // Function to send messages with delay
  const sendMessages = async () => {
    const img = MessageMedia.fromFilePath(imagePath)
    const pdf = MessageMedia.fromFilePath(pdfPath)
    for (let i = 0; i < numbers.length; i++) {
      const number = numbers[i]
      const formattedNumber = `91${number}@c.us`

      try {
        await client.sendMessage(formattedNumber, img, { caption: message })
        await client.sendMessage(formattedNumber, pdf)
        successCount++
      } catch (err) {
        failureCount++
        failedNumbers.push(number)
      }

      checkCompletion()
      await new Promise((resolve) => setTimeout(resolve, 5000)) // delay
    }
  }
  sendMessages()
})

client.initialize()
