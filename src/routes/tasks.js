/**
 * @typedef {Object} Route
 *
 * @property {string} method
 * @property {string} path
 * @property {Function} handler
 */

/**
 * @type {Route[]}
 */
export const tasksRoutes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      return res.end("test");
    },
  },
];
