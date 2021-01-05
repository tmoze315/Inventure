module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    modulePathIgnorePatterns: ['dist'],
    setupFilesAfterEnv: ['jest-extended', '<rootDir>/jest.setup.js'],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    }
};