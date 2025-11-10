import nextJest from 'next/jest.js'

const createJestConfig = nextJest({

    dir: './',
})


/** @type {import('jest').Config} */
const config = {

    roots: ['<rootDir>/src', '<rootDir>/prisma'],


    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],


    testEnvironment: 'jest-environment-jsdom',


    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^prisma/singleton$': '<rootDir>/prisma/singleton.ts'
    },

    coveragePathIgnorePatterns: [
        '<rootDir>/prisma/singleton.ts'
    ]
}

export default createJestConfig(config)