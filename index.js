const { Client } = require('whatsapp-web.js')
const qrcode = require('qrcode-terminal')

// Initialize the client
const client = new Client({
  webVersionCache: {
    type: 'remote',
    remotePath:
      'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2410.1.html',
  },
})

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true })
})

// Confirm when authenticated
client.on('ready', () => {
  console.log('Client is ready!')

  // Define numbers and message directly in the script
  const numbers = [] // Add no. in string without '-' and space
  const message = `Hello! This is a test message.\n\nPlease visit the following link for more information:\nhttps://explorin.io`

  // Send messages to all numbers
  numbers.forEach((number) => {
    const formattedNumber = `91${number}@c.us`

    client
      .sendMessage(formattedNumber, message)
      .then((res) => {
        console.log(`Message sent to ${number}`)
      })
      .catch((err) => {
        console.error(`Failed to send message to ${number}:`, err)
      })
  })
})

client.initialize()
