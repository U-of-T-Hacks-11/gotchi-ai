// server.js
const express = require('express')
const { CohereClient } = require('cohere-ai')

const { MongoClient, ServerApiVersion } = require('mongodb')
const uri =
  'mongodb+srv://mizrahielai:bUaFocH6zmq3QLFE@tamagotchi.sqyejfv.mongodb.net/?retryWrites=true&w=majority'

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect()
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 })
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    )
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close()
  }
}
run().catch(console.dir)

const app = express()
var cors = require('cors')
app.use(cors())

const port = process.env.PORT || 3001

const cohere = new CohereClient({
  token: 'jFm3kg3Xxyq8RB4ryTSYnCxF3Ze9dAUjcDf4EEyw', // Replace with your actual API key
})

const examples = [
  { text: 'Start a 25-minute pomodoro timer', label: 'timer' },
  { text: 'Set a timer for 30 minutes', label: 'timer' },
  { text: 'Begin a 10-minute break', label: 'timer' },
  { text: 'Take a short break', label: 'timer' },
  { text: 'Start a new work session', label: 'timer' },
  { text: 'Create a note for the meeting', label: 'Take notes' },
  { text: 'Take notes on the presentation', label: 'Take notes' },
  { text: 'Jot down key points', label: 'Take notes' },
  { text: 'Write a summary of the discussion', label: 'Take notes' },
  { text: 'Capture action items in a note', label: 'Take notes' },
  { text: 'Record my thoughts', label: 'Take notes' },
  { text: 'Draft ideas for the project', label: 'Take notes' },
  { text: 'Create a checklist', label: 'Take notes' },
  { text: 'Write down important details', label: 'Take notes' },

  // Summarizer
  { text: 'Summarize the main points of the article', label: 'Summarizer' },
  { text: 'Give me a concise overview of the report', label: 'Summarizer' },
  {
    text: 'Condense the key information from the document',
    label: 'Summarizer',
  },
  { text: 'Provide a summary of the research findings', label: 'Summarizer' },
  { text: 'Outline the main arguments in the essay', label: 'Summarizer' },
  { text: 'Give me a brief recap of the key takeaways', label: 'Summarizer' },

  // Take Notes
  { text: 'Document key insights from the meeting', label: 'Take notes' },
  {
    text: 'Record important details from the conversation',
    label: 'Take notes',
  },
  { text: 'Jot down critical points during the lecture', label: 'Take notes' },
  {
    text: 'Capture essential information for later reference',
    label: 'Take notes',
  },
  {
    text: 'Create a detailed record of the client discussion',
    label: 'Take notes',
  },
  { text: 'Note down action items from the team meeting', label: 'Take notes' },
  { text: 'Document the project requirements in a note', label: 'Take notes' },

  // Timer
  { text: 'Set a 45-minute focus timer', label: 'timer' },
  { text: 'Begin a 20-minute productivity session', label: 'timer' },
  { text: 'Initiate a 15-minute brainstorming timer', label: 'timer' },
  { text: 'Start a 5-minute quick task timer', label: 'timer' },
  { text: 'Set a timer for a 1-hour deep work session', label: 'timer' },

  // Feed Pet
  { text: 'Feed the cat its breakfast', label: 'Feed pet' },
  { text: 'Give the dog a treat for good behavior', label: 'Feed pet' },
  { text: 'Provide food and water for the pet rabbit', label: 'Feed pet' },
  { text: 'Ensure the fish in the tank are fed', label: 'Feed pet' },
  { text: 'Offer a snack to the parrot in the cage', label: 'Feed pet' },
  { text: 'Give the hamster fresh food and water', label: 'Feed pet' },
]
app.get('/api/router', async (req, res) => {
  try {
    const message =
      req.headers['message'] + ' keep your response under 15 words' ||
      'Default message if header is not provided'

    const response = await cohere.classify({
      inputs: [message],
      examples: examples,
    })

    console.log(
      response.classifications[0].prediction,
      response.classifications[0].confidence
    )

    if (response.classifications[0].confidence > 0.9) {
      res.json({
        prediction: response.classifications[0].prediction,
        // confidence: response.classifications[0].confidence,
      })
    } else {
      // res.json({ prediction: 'Fallback', confidence: 0 });
      res.json({ prediction: 'Fallback' })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.get('/api/chat', async (req, res) => {
  try {
    // Extract user's message from headers
    const userMessage =
      req.headers['message'] + ' keep your response under 15 words' ||
      'Default message if header is not provided'

    console.log(req.headers)
    console.log(userMessage)
    console.log(req.headers['chathistory'])
    const parsedChatHistory = JSON.parse(req.headers['chathistory'])
    console.log('CHAT:' + parsedChatHistory)
    const headers = parsedChatHistory
      ? {
          chatHistory: parsedChatHistory,
          message: userMessage, // Use the user's message as the initial message
          connectors: [{ id: 'web-search' }],
        }
      : {
          message: userMessage, // Use the user's message as the initial message
          connectors: [{ id: 'web-search' }],
        }
    console.log(req.headers)

    const chatStream = await cohere.chatStream(headers)

    const messages = []

    for await (const message of chatStream) {
      if (message.eventType === 'text-generation') {
        messages.push(message.text)
        console.log(message.text)
      }
    }

    res.json(messages)
  } catch (error) {
    console.error('Error in chatStream:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// app.get('/api/summarize', async (req, res) => {
//   console.log('summary!!')
//   try {
//     const userMessage = req.headers['message']
//     const summarize = await cohere.summarize({
//       text: userMessage,
//     })

//     console.log(summarize)

//     // Assuming the 'summarize' response contains the summarized text in 'summary' property
//     const summarizedText = summarize.summary || 'No summary available'

//     res.json({ summary: summarizedText })
//   } catch (error) {
//     console.error('Error in /api/summarize:', error)
//     res.status(500).json({ error: 'Internal Server Error' })
//   }
// })

app.get('/api/summarize', async (req, res) => {
  console.log('summary!!')

  try {
    const userMessage = req.headers['message']
    console.log('User Message:', userMessage) // Add this line

    const summarize = await cohere.summarize({
      text: userMessage,
    })

    console.log('Summarize Response:', summarize) // Add this line

    if (!summarize || summarize.error) {
      console.error(
        'Error in summarize API call:',
        summarize?.error || 'Unknown error'
      )
      res.status(500).json({ error: 'Internal Server Error' })
      return
    }

    const summarizedText = summarize.summary || 'No summary available'
    res.json({ summary: summarizedText })
  } catch (error) {
    console.error('Error in /api/summarize:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

app.post('/api/notes', async (req, res) => {
  try {
    console.log(req.headers)
    const title = req.headers['title']
    const description = req.headers['description']
    await client.connect()
    const db = client.db('tamagotchi') // Specify your database name
    const notesCollection = db.collection('notes') // Specify your collection name

    // Insert the new note into the database
    const result = await notesCollection.insertOne({ title, description })

    // Respond with the inserted note
  } catch (error) {
    console.error('Error creating a new note:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    await client.connect()
    const db = client.db('tamagotchi') // Specify your database name
    const notesCollection = db.collection('notes') // Specify your collection name

    // Fetch all notes from the database
    const notes = await notesCollection.find().toArray()
    console.log(notes)

    // Respond with the fetched notes
    res.json(notes)
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params
    const db = client.db('tamagotchi') // Specify your database name
    const notesCollection = db.collection('notes') // Specify your collection name

    // Delete the note from the database
    const result = await notesCollection.deleteOne({ _id: new ObjectId(id) })

    // Respond with the deletion status
    if (result.deletedCount > 0) {
      res.json({ message: 'Note deleted successfully' })
    } else {
      res.status(404).json({ message: 'Note not found' })
    }
  } catch (error) {
    console.error('Error deleting a note:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
