const { build } = require('esbuild');

build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/index.js',
  format: 'cjs',
  external: [
    // Keep dotenv external so .env loading works at runtime
  ],
  sourcemap: true,
}).then(() => {
  console.log('Build complete');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
