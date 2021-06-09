import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy-assets';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'main.js'
    , external: ['url-search-params', 'log']
    , output: {
        format: 'es'
        , dir: 'dist/work'
        , plugins: [
            terser({
                ecma: 2018
                , mangle: { toplevel: true }
                , compress: {
                    module: true
                    , toplevel: true
                    , unsafe_arrows: true
                    , drop_console: true
                    , drop_debugger: true
                }
                , output: { quote_style: 1 }
            })
        ]
    }
    , preserveModules: false
    , plugins: [
        commonjs()
        , resolve()
        , copy({
            assets: [
                './bundle.json'
            ]
        })
        , json()
    ]
};