module.exports = {
	roots:['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns:[
	"/node_modules"
	],
	testMatch: ['<rootDir>/src/**/*.test.ts'],
  verbose:true,
  //setupFilesAfterEnv: ['./jest.setup.ts'] need this for loading things before testing.. kinda like before all 
 };
