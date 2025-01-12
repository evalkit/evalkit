import * as dotenv from 'dotenv';
import type {Config} from '@jest/types';

dotenv.config()

// Sync object
const config: Config.InitialOptions = {
	verbose: true,
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	coveragePathIgnorePatterns: [
		'node_modules',
		'config.ts'
	]
};
export default config;