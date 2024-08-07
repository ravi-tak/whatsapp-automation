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

  const imagePath = path.resolve(__dirname, 'motivation.png') // Path to your image file
  // const message = `Hello!\n\nhttps://www.youtube.com/watch?v=y9gIg2MwIRg&ab_channel=TheAthElite`

  let successCount = 0
  let failureCount = 0
  const failedGroupIds = []

  const targetGroupNames = '' // Group name
  // Fetch all group IDs
  const chats = await client.getChats()
  const groups = chats.filter((chat) => chat.isGroup)
  const targetGroups = groups.filter((group) =>
    group.name?.includes(targetGroupNames)
  )
  const targetGroupIds = targetGroups.map((group) => group.id._serialized)
  // console.log(targetGroups)
  // console.log(targetGroupIds.length)

  // Function to check if all messages have been processed
  const checkCompletion = () => {
    if (successCount + failureCount === targetGroupIds.length) {
      console.log(
        `Messages sent successfully: ${successCount}/${targetGroupIds.length}`
      )
      if (failedGroupIds.length > 0) {
        console.log(`failed Group Ids: ${failedGroupIds}`)
      }
    }
  }

  // Function to send messages with delay
  const sendMessages = async () => {
    const media = MessageMedia.fromFilePath(imagePath)
    for (let i = 0; i < targetGroupIds.length; i++) {
      const groupId = targetGroupIds[i]
      try {
        await client.sendMessage(groupId, media)
        successCount++
      } catch (err) {
        failureCount++
        failedGroupIds.push(groupId)
      }
      checkCompletion()
      await new Promise((resolve) => setTimeout(resolve, 2000)) // delay
    }
  }
  sendMessages()
})

client.initialize()
