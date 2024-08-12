import { buildRoutePath } from "../utils/build-route-path.js";
import http from "node:http";

/**
 * @typedef {Object} Route
 *
 * @property {string} method
 * @property {RegExp} path
 * @property {Function} handler
 */

/**
 * @type {Route[]}
 */
export const tasksRoutes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      return res.end("test");
    },
  },
];
