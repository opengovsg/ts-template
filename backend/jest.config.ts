import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/jest-dotenv.config.js'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
  moduleNameMapper: {
    '~shared/(.*)': '<rootDir>/../shared/src/$1'
  }
}

export default config
