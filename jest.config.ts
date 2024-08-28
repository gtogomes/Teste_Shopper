import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

export default config;

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 10000, 
  };
  
