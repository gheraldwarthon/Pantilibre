import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

// The preview/dev server runs from the project root; its .env holds the
// Supabase credentials. Re-export them here so import.meta.env always has
// them, regardless of which directory the server was started from.
const rootEnv = (() => {
  try {
    return fs.readFileSync(path.resolve(__dirname, '../.env'), 'utf8');
  } catch {
    return '';
  }
})();

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, __dirname, 'VITE_');
  for (const [key, value] of Object.entries(env)) {
    process.env[key] = value;
  }
  const urlMatch = rootEnv.match(/^VITE_SUPABASE_URL=(.*)$/m);
  const keyMatch = rootEnv.match(/^VITE_SUPABASE_ANON_KEY=(.*)$/m);
  if (urlMatch) process.env.VITE_SUPABASE_URL = urlMatch[1].trim();
  if (keyMatch) process.env.VITE_SUPABASE_ANON_KEY = keyMatch[1].trim();

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL ?? ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY ?? ''),
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
