import express from 'express'
import { AppDataSource } from './data-source'
import { User } from './entities/User'

const app = express()
app.use(express.json())

AppDataSource.initialize().then(() => {
  console.log('[✅] DB connected')

  app.get('/users', async (req, res) => {
    const users = await AppDataSource.getRepository(User).find()
    res.json(users)
  })

  app.listen(3001, () => {
    console.log('[🚀] Server running at http://localhost:3001')
  })
}).catch(err => console.error('[❌] DB connection error:', err))
