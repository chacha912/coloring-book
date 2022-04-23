import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory
  const env = loadEnv(mode, process.cwd());
  console.log(env);
  return {
    base: '',
    plugins: [svelte()],
    server: {
      proxy: {
        '/v1': env.VITE_BASE_API,
      },
    },
  };
});
