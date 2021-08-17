import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
}

export default config
