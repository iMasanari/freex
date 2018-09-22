// @ts-check

import typescript from 'rollup-plugin-typescript2'
import { readFileSync } from 'fs'

const packages = JSON.parse(readFileSync('./package.json', 'utf-8'))

export default {
  input: './src/index.ts',
  output: [{
    file: packages.main,
    format: 'umd',
    name: 'freex'
  }, {
    file: packages.module,
    format: 'esm',
  }],
  plugins: [
    typescript(),
  ],
}
