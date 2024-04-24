const { describe, it, beforeEach, afterEach } = require('mocha')
const axios = require('axios')
const chai = require('chai')
const sinon = require('sinon')
const UserDataHandler = require('../data_handlers/user_data_handler')

let sandbox
let userDataHandler
const expect = chai.expect

describe('UserDataHandler', () => {
  beforeEach(() => {
    sandbox = sinon.createSandbox()
    userDataHandler = new UserDataHandler()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('should load user data', async () => {
    const data = [{ id: 1, email: 'test1@gmail.com' }, { id: 2, email: 'test2@gmail.com' }]
    sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))

    await userDataHandler.loadUsers()
    expect(userDataHandler.users.length).to.equal(2)
  })

  it('should return user emails list', () => {
    userDataHandler.users = [{ id: 1, email: 'test1@gmail.com' }, { id: 2, email: 'test2@gmail.com' }]

    const emails = userDataHandler.getUserEmailsList()
    expect(emails).to.equal('test1@gmail.com;test2@gmail.com')
  })

  it('should return number of users', () => {
    userDataHandler.users = [{ id: 1, email: 'test1@gmail.com' }, { id: 2, email: 'test2@gmail.com' }]

    const count = userDataHandler.loadUsers()
    expect(count).to.equal(2)
  })

  it('should return matching users', () => {
    userDataHandler.users = [
      { id: 1, email: 'test1@gmail.com', name: 'Test 1' },
      { id: 2, email: 'test2@gmail.com', name: 'Test 2' }
    ]

    const users = userDataHandler.findUsers({ name: 'Test 1' })
    expect(users.length).to.equal(1)
    expect(users[0].email).to.equal('test1@gmail.com')
  })
  it('should get the number of users', () => {
    userDataHandler.users = [{ email: 'test1@test.com' }, { email: 'test2@test.com' }]
    const userCount = userDataHandler.getNumberOfUsers()
    expect(userCount).to.equal(2)
  })

  it('should handle no users while getting number of users', () => {
    userDataHandler.users = []
    const userCount = userDataHandler.getNumberOfUsers()
    expect(userCount).to.equal(0)
  })

  it('should find matching users ', () => {
    userDataHandler.users = [{ name: 'John', age: 30 }, { name: 'Tom', age: 35 }]
    const searchParams = { age: 30 }
    const matchingUsers = userDataHandler.findUsers(searchParams)
    expect(matchingUsers).to.deep.equal([{ name: 'John', age: 30 }])
  })

  it('should handle no search parameters while finding users', () => {
    userDataHandler.users = [{ name: 'John', age: 30 }, { name: 'Tom', age: 35 }]
    try {
      userDataHandler.findUsers('')
    } catch (err) {
      expect(err.message).to.throw('No search parameters provided!')
    }
  })

  it('should handle no users loaded while finding users', () => {
    userDataHandler.users = []
    try {
      userDataHandler.findUsers({ name: 'John' })
    } catch (err) {
      expect(err.message).to.equal('No users loaded!')
    }
  })

  it('should handle no matching users found', () => {
    userDataHandler.users = [{ name: 'John', age: 30 }, { name: 'Tom', age: 35 }]
    try {
      userDataHandler.findUsers({ name: 'Peter' })
    } catch (err) {
      expect(err.message).to.equal('No matching users found!')
    }
  })
  it("should throw an error if the loading users' data fails", async function () {
    const stub = sandbox.stub(axios, 'get').rejects(new Error('Fake error'))
    try {
      expect(await userDataHandler.loadUsers()).to.throw('The function did not throw an error')
    } catch (err) {
      expect(err.message).to.contain('Failed to load users data')
    } finally {
      stub.restore()
    }
  })

  it('should throw an error if no users loaded when getting emails list', () => {
    try {
      userDataHandler.getUserEmailsList()
      expect.fail('The function did not throw an error')
    } catch (err) {
      expect(err.message).to.equal('No users loaded!')
    }
  })

  it('should throw an error if no search parameters provided when finding users', () => {
    try {
      userDataHandler.findUsers()
      expect.fail('The function did not throw an error')
    } catch (err) {
      expect(err.message).to.equal('No search parameters provided!')
    }
  })

  it('should throw an error if no matching users found when finding users', () => {
    userDataHandler.users = [{ id: 1, name: 'John' }]

    try {
      userDataHandler.findUsers({ name: 'Peter' })
      expect.fail('The function did not throw an error')
    } catch (err) {
      expect(err.message).to.equal('No matching users found!')
    }
  })
})
