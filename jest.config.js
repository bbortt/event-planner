const nextJest = require('next/jest');
const babelConfig = require('./babel.config');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  collectCoverageFrom: ['<rootDir>/src/main/webapp/*.js'],
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/test/js/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.owl/', '<rootDir>/node_modules/', '<rootDir>/src/test/e2e/'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { ...babelConfig }],
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};

module.exports = createJestConfig(customJestConfig);
