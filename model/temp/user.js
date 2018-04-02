const users = []
let id = 0

class User {
  constructor (firstName, lastName, age) {
    this.firstName = firstName
    this.lastName = lastName
    this.age = age
    this.id = id++
  }

  getName () {
    return `${this.firstName} ${this.lastName}`
  }

  // static 静态方法 不是实例去用，而是类去用，也可以用静态方法生成实例
  static insert(firstName, lastName, age) {
    const user = new User(firstName, lastName, age)
    User.users.push(user)
    return user
  }

  static getOneByName(firstName, lastName) {
    return User.users.find(u => u.firstName === firstName && u.lastName === lastName)
  }

  static getOneById(userId) {
    return User.users.find(u => u.id === userId)
  }

  static list(query) {
    return User.users
  }

  static get ['id'] () {
    return id
  }
 
  static get ['users'] () {
    return users
  }
}




module.exports = User