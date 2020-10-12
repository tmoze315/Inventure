module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['dist'],
  moduleNameMapper: {
    "@exmpl/(.*)": "<rootDir>/src/$1"
  },
};