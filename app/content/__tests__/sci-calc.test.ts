import { subtract } from '../src/sci-calc'

describe('subtract', () => {
  it('should subtract a number from another', () => {
    expect(subtract(5,3)).toEqual(2)
  })
})
