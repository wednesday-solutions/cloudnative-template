import { argv, exit, env } from 'node:process';
import { build } from 'esbuild';

const entryPoint = argv[2];
const outdir = argv[3];

try {
  build({
    entryPoints: [entryPoint],
    outdir,
    minify: env.NODE_ENV === 'production',
    bundle: true,
    platform: 'node',
    target: 'node18',
    external: ['esbuild'],
  });
} catch (error) {
  console.error(error);
  exit(1);
}
