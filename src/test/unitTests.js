const { describe, it, beforeEach, afterEach } = require('mocha')
const axios = require('axios')
const chai = require('chai')
const sinon = require('sinon')
const UserDataHandler = require('../data_handlers/user_data_handler')
const data = require('../../data/constants/responseBody')
const { emailList } = require('./testData/data')
const expect = chai.expect

describe('UserDataHandler:', () => {
  let sandbox
  const userDataHandler = new UserDataHandler()
  beforeEach(() => {
    sandbox = sinon.createSandbox()
  })

  afterEach(() => {
    sandbox.restore()
  })

  describe('loadUsers:', () => {
    it('should return usersList with properties from loadUsers', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))
      await userDataHandler.loadUsers()
      const response = userDataHandler.users

      response.forEach(item => {
        expect(item).not.to.have.property('ids')
        expect(item).to.have.property('id')
        expect(item).to.have.property('name')
        expect(item).to.have.property('username')
        expect(item).to.have.property('email')
      })
    })

    it('should return error in case of load fail', async () => {
      sandbox.stub(axios, 'get').returns(Promise.reject(new Error('System issue')))

      try {
        await userDataHandler.loadUsers()
      } catch (err) {
        await expect(err.message).to.contain('Failed to load users data:')
      }
    })
  })
  describe('getNumberOfUsers:', () => {
    it('should return number of users', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))

      await userDataHandler.loadUsers()
      const count = userDataHandler.getNumberOfUsers()

      expect(count).to.equal(10)
    })
  })

  describe('findUsers:', () => {
    it('should return matching user', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))
      await userDataHandler.loadUsers()
      const foundUser = userDataHandler.findUsers({ name: 'Kurtis Weissnat' })

      expect(foundUser.length).to.equal(1)
      expect(foundUser[0].email).to.equal('Telly.Hoeger@billy.biz')
    })

    it('should handle no search parameters while finding users', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))
      await userDataHandler.loadUsers()
      try {
        userDataHandler.findUsers()
      } catch (err) {
        expect(err.message).to.equal('No search parameters provided!')
      }
    })

    it('should handle no matching users found', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))
      await userDataHandler.loadUsers()
      try {
        userDataHandler.findUsers({ name: 'Peter' })
      } catch (err) {
        expect(err.message).to.equal('No matching users found!')
      }
    })

    it('should handle no users loaded while finding users', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data: [] }))
      await userDataHandler.loadUsers()
      try {
        userDataHandler.findUsers({ name: 'John' })
      } catch (err) {
        expect(err.message).to.equal('No users loaded!')
      }
    })
  })
  describe('getUserEmailsList:', () => {
    it('should return user emails list', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data }))
      await userDataHandler.loadUsers()
      const emails = await userDataHandler.getUserEmailsList()
      expect(emails).to.equal(emailList)
    })

    it('should return error in case no users loaded while getting email list', async () => {
      sandbox.stub(axios, 'get').returns(Promise.resolve({ data: [] }))
      await userDataHandler.loadUsers()

      try {
        await userDataHandler.getUserEmailsList()
      } catch (error) {
        expect(error.message).to.include('No users loaded!')
      }
    })
  })
})
