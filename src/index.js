import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes/index.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const port = process.env.PORT ?? 3000;

/**
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  const route = routes.find((r) => r.method === method && r.path.test(url));

  if (route) {
    const routeParams = req.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    req.params = params;
    req.query = query ? extractQueryParams(query) : {};

    return route.handler(req, res);
  }

  return res.writeHead(404).end();
});

server.listen(port);
