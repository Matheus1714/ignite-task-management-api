import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes/index.js";

const port = process.env.PORT ?? 3000;

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((r) => r.method === method && r.path === url);

  if (route) {
    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(port);
