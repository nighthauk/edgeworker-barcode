import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy-assets';

export default {
    input: 'main.js'
    , external: ['url-search-params', 'log']
    , output: {
        format: 'es'
        , dir: 'dist/work'
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
    ]
};