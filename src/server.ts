import { consola } from 'consola';
import { dmStore } from './config';
import { routes as oauth2Routes } from './oauth2';

const PORT = Bun.env.PORT || 5000;

const routes: Record<string, (req: Request) => Promise<Response>> = {
  ...oauth2Routes,
  '/': async () => new Response('OK'),
  '/config': async () => {
    const dmStoreList: any[] = [];

    dmStore.forEach((value, key) => {
      dmStoreList.push({
        user: key,
        lastSent: value,
        lastSentFormatted: new Date(value).toLocaleString(),
      });
    });

    return Response.json({ dmStore: dmStoreList });
  },
};

Bun.serve({
  routes,
  fetch(req) {
    const url = new URL(req.url);
    const route = routes[url.pathname];
    return route ? route(req) : new Response('Route Not Found', { status: 404 });
  },
  port: PORT,
});

consola.info(`Server running at http://localhost:${PORT}`);
