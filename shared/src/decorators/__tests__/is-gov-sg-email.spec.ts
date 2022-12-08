import { validate } from 'class-validator'

import { IsGovSgEmail } from '../is-gov-sg-email'

describe('IsGovSgEmail', () => {
  class TestClass {
    @IsGovSgEmail()
    email: unknown
  }

  it('rejects non-strings', async () => {
    const test = new TestClass()
    test.email = 2
    const result = await validate(test)
    expect(result.length).toBe(1)
  })

  it('rejects bad emails', async () => {
    const test = new TestClass()
    test.email = 'bad@gmail.com,victim@open.gov.sg'
    const result = await validate(test)
    expect(result.length).toBe(1)
  })

  it('rejects non-gov.sg emails', async () => {
    const test = new TestClass()
    test.email = 'bad@gmail.com'
    const result = await validate(test)
    expect(result.length).toBe(1)
  })

  it('accepts gov.sg emails', async () => {
    const test = new TestClass()
    test.email = 'team@open.gov.sg'
    const result = await validate(test)
    expect(result).toStrictEqual([])
  })
})
