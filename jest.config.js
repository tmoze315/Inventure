module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['dist'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};