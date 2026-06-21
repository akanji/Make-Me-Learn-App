import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      // This forces Vite to use secure websockets through the AI Studio proxy
      protocol: 'wss', 
      clientPort: 443,
    },
  },
});
