import { consola } from 'consola';
import { dmStore } from './config';
import { routes as oauth2Routes } from './oauth2';

const PORT = Bun.env.PORT || 5000;

const routes: Record<string, (req: Request) => Promise<Response>> = {
  ...oauth2Routes,
  '/': async () => new Response('OK'),
  '/config': async (req) => {
    const dmStoreList = Array.from(dmStore, ([key, value]) => ({ user: key, lastSent: value }));

    if (req.headers.get('content-type') === 'text/plain') {
      return new Response(
        dmStoreList
          .map((item) => `- User: ${item.user} | Last Sent: ${new Date(item.lastSent).toLocaleString()}`)
          .join('\n'),
        {
          headers: { 'Content-Type': 'text/plain' },
        }
      );
    }

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
