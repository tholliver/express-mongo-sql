import mongoose from '../db/mongo/mongoose.js'
import supertest from 'supertest'
import app from '../app.js'

const api = supertest(app)

test('notes are returned as json', async () => {
  await api.get('/films').expect(200)
})

afterAll(() => {
  mongoose.connection.close()
})
