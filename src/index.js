import http from "node:http";

import { routes } from "./routes/index.js";

const port = process.env.PORT ?? 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;

  const route = routes.find((r) => r.method === method && r.url === path);

  if (route) {
    route.handler(req, res);
  }
});

server.listen(port);
