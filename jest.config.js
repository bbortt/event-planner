const nextJest = require('next/jest');
const babelConfig = require('./babel.config');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  collectCoverage: true,
  collectCoverageFrom: ['<rootDir>/src/main/webapp/*.js'],
  coverageDirectory: '<rootDir>/build/test-results/',
  moduleNameMapper: {
    '^.+\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    '^@/pages/(.*)$': '<rootDir>/pages/$1',
  },
  reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/build/test-results/', outputName: 'TESTS-results-jest.xml' }]],
  setupFilesAfterEnv: ['<rootDir>/src/test/js/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/.owl/', '<rootDir>/node_modules/', '<rootDir>/src/test/e2e/'],
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { ...babelConfig }],
  },
  transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
};

module.exports = createJestConfig(customJestConfig);
