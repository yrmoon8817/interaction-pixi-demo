import glsl from 'rollup-plugin-glsl';

export default {
  input: 'src/main.js',
  output: {
    file: 'dist/bundle.js',
    format: 'es'
  },
  plugins: [glsl()]
};