import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import typescript2 from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';
import path from 'path';
import sizes from 'rollup-plugin-sizes';

export function createRollupConfig(packageName, config = {
    packageJson,
}) {
    const { packageJson } = config;

    function isExternal(moduleName) {
        const internal =
            moduleName.includes('@evalkit') ||
            moduleName.includes('evalkit/apps') ||
            moduleName.includes('evalkit/packages') ||
            moduleName.includes('packages/') ||
            /^\.{0,2}\//.test(moduleName);
        return !internal;
    }

    const LIB_PATH = `packages/${packageName}`;
    const DIST_PATH = `dist`;

    const localPkg = require(path.resolve(
        process.cwd().includes(LIB_PATH) ? path.resolve(process.cwd(), '../..') : process.cwd(),
        `${LIB_PATH}/package.json`
    ));

    const input = path.resolve(
        process.cwd().includes(LIB_PATH) ? path.resolve(process.cwd(), '../..') : process.cwd(),
        `${LIB_PATH}/src/index.ts`
    );

    return {
        input: './src/index.ts', // entry point
        output: [
            {
                file: packageJson.main, // CommonJS output
                format: 'cjs',
                sourcemap: true,
            },
            {
                file: packageJson.module, // ESModule output
                format: 'es',
                sourcemap: true,
            },
        ],
        external: isExternal,
        plugins: [
            peerDepsExternal(), // Automatically externalize peerDependencies in package.json
            resolve(), // Helps Rollup find node_modules
            commonjs(), // Converts CommonJS modules to ES6
            typescript2({
                tsconfig: path.resolve(process.cwd(), 'tsconfig.json'),
                compilerOptions: { outDir: DIST_PATH, sourceMap: true },
            }),
            terser(), // Minify the output
            copy({
                targets: [
                    {
                        src: "./LICENSE",
                        dest: DIST_PATH,
                    },
                    {
                        src: path.resolve(LIB_PATH, "README.md"),
                        dest: DIST_PATH,
                    },
                ],
            }),
            sizes({ details: true }),
        ],
    }
}
