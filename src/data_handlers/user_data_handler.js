const axios = require('axios').default

class UserDataHandler {
  constructor () {
    this.users = []
  }

  async loadUsers () {
    const response = await axios.get('http://localhost:3000/users').catch(err => {
      throw new Error(`Failed to load users data: ${err}`)
    })
    this.users = response.data
  }

  getUserEmailsList () {
    if (this.users.length === 0) throw new Error('No users loaded!')
    const arrayOfEmails = this.users.map(user => user.email)
    const listOfUSerEmails = arrayOfEmails.join(';')
    return listOfUSerEmails
  }

  getNumberOfUsers () {
    return this.users.length
  }

  isMatchingAllSearchParams (user, searchParamsObject) {
    let isMatching = true
    for (const searchParam in searchParamsObject) {
      if (user[searchParam] !== searchParamsObject[searchParam]) {
        isMatching = false
      }
      if (isMatching === false) break
    }
    return isMatching
  }

  findUsers (searchParamsObject) {
    if (!searchParamsObject) throw new Error('No search parameters provided!')
    if (this.users.length === 0) throw new Error('No users loaded!')
    const matchingUsers = this.users.filter(user => this.isMatchingAllSearchParams(user, searchParamsObject))
    if (matchingUsers.length === 0) throw new Error('No matching users found!')
    return matchingUsers
  }
}
module.exports = UserDataHandler
