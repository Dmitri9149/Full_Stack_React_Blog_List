const bcrypt = require('bcrypt')
const User = require('../models/user')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const listHelper = require('../utils/list_helper')

/* root_like is different from new_user */
/* root_password is different from new_password */
const root_like = process.env.ROOT_LIKE
const root_password = process.env.ROOT_PASSWORD
const new_user = process.env.NEW_USER
const new_password = process.env.NEW_PASSWORD

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(root_password, 10)
  const user = new User({ username: root_like, passwordHash })

  await user.save()
})

describe('when there is initially one user at db', () => {

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: new_user,
      name: 'Matti Luukkainen',
      password: new_password,
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: root_like,
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is undefined', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: null,
      name: 'Superuser',
      password: 'salainenNull',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Path `username` is required')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'SuperuserRo',
      password: 'salainenRo',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Path `username` (`ro`) is shorter than')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'rooot',
      name: 'superuserRooo',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password length is less than 3')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is undefined', async () => {
    const usersAtStart = await listHelper.usersInDb()

    const newUser = {
      username: 'roooot',
      name: 'superuserRoooo'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('undefined password')

    const usersAtEnd = await listHelper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

})

afterAll(() => {
  mongoose.connection.close()
})
