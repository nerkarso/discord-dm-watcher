import { consola } from 'consola';
import { routes as oauth2Routes } from './oauth2';

const PORT = Bun.env.PORT || 5000;

Bun.serve({
  routes: {
    ...oauth2Routes,
    '/': new Response('OK'),
  },
  fetch() {
    return new Response('Route Not Found', { status: 404 });
  },
  port: PORT,
});

consola.info(`Server running at http://localhost:${PORT}`);
