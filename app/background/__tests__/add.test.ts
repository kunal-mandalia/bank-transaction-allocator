import { add, myAge } from '../src/calc'

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(1,2)).toEqual(3)
  })
})

describe('myAge', () => {
  it('should return my age', () => {
    const user: User = {
      name: 'a',
      mail: '',
      age: 42
    }
    expect(myAge(user)).toEqual(42)
  })
})