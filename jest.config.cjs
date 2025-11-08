/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    testRegex: '.*\\.test\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': ['ts-jest', { useESM: true, tsconfig: './tsconfig.json' }],
    },
    collectCoverageFrom: ['src/**/*.{ts,js}'],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
};
