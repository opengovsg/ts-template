import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest/presets/default-esm',
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,js}'],
  coveragePathIgnorePatterns: ['<rootDir>/build', '<rootDir>/node_modules'],
}

export default config
