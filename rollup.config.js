import path from 'node:path'
import ts from 'rollup-plugin-ts'
import esbuild from 'rollup-plugin-esbuild'
import license from 'rollup-plugin-license'

const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json')
const BASE_OUTPUT = {
  exports: 'named',
  sourcemap: true,
  name: 'dotNotationTokenizer'
}
const LICENSE_OPTIONS = {
  banner: {
    commentStyle: 'regular',
    content: {
      file: path.resolve(__dirname, 'banner.txt')
    }
  }
}

/** @type {import('rollup').RollupOptions} */
export default [
  {
    input: 'src/index.ts',
    output: [
      { ...BASE_OUTPUT, file: 'dist/index.js', format: 'umd' },
      { ...BASE_OUTPUT, file: 'dist/index.cjs', format: 'cjs' },
      { ...BASE_OUTPUT, file: 'dist/index.mjs', format: 'es' }
    ],
    plugins: [
      esbuild({
        tsconfig: TSCONFIG_PATH
      }),
      license(LICENSE_OPTIONS)
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      ...BASE_OUTPUT,
      file: 'dist/index.min.js',
      format: 'umd'
    },
    plugins: [
      esbuild({
        tsconfig: TSCONFIG_PATH,
        minify: true
      }),
      license(LICENSE_OPTIONS)
    ]
  },
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es'
    },
    plugins: [
      ts({
        tsconfig: {
          fileName: TSCONFIG_PATH,
          hook: config => ({
            ...config,
            declaration: true,
            emitDeclarationOnly: true
          })
        }
      })
    ]
  }
]
