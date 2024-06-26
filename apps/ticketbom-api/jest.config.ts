/* eslint-disable */
export default {
  displayName: 'ticketbom-api',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  setupFiles: ['dotenv/config'],
  coverageDirectory: '../../coverage/apps/ticketbom-api',
};
