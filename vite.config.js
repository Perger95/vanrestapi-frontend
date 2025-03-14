import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('C:/xampp/apache/conf/ssl.key/server.key'),
      cert: fs.readFileSync('C:/xampp/apache/conf/ssl.crt/server.crt')
    },
    port: 5173, // Maradhat ugyanaz a port
  }
});
