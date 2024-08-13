import http from "node:http";
import { randomUUID } from "node:crypto";

import { Database } from "../database.js";
import { buildRoutePath } from "../utils/build-route-path.js";

/**
 * @typedef {Object} Route
 *
 * @property {string} method
 * @property {RegExp} path
 * @property {function(http.IncomingMessage, http.ServerResponse): http.ServerResponse} handler
 */

const database = new Database();

/**
 * @type {Route[]}
 */
export const tasksRoutes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query;

      const search = {};

      if (title) search.title = title;
      if (description) search.description = description;

      const tasks = database.select("tasks");
      return res.end(JSON.stringify(tasks, search));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req?.body;

      if (!req.body || !title || !description) {
        return res.writeHead(400).end();
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      };

      database.insert("tasks", task);

      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;
      if (!req.params || !id) {
        return res.writeHead(400).end();
      }
      const task = database.delete("tasks", id);
      return res.writeHead(204).end(task);
    },
  },
  {
    method: "PUT",
    path: buildRoutePath("/tasks/:id"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!id) return res.writeHead(400).end();
      if (!req.body) return res.end();

      const { title, description } = req.body;

      const task = database.findById("tasks", id);

      if (!task)
        return res.end(
          JSON.stringify({
            message: `Registro ${id} inexistente`,
          })
        );

      if (title) task.title = title;
      if (description) task.description = description;

      if (title || description) task.updated_at = new Date();

      database.update("tasks", id, task);

      return res.end(JSON.stringify(task));
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!id) return res.writeHead(400).end();

      const task = database.findById("tasks", id);

      if (!task)
        return res.end(
          JSON.stringify({
            message: `Registro ${id} inexistente`,
          })
        );

      if (!task.completed_at) {
        task.completed_at = new Date();

        database.update("tasks", id, task);
      }

      return res.end(JSON.stringify(task));
    },
  },
];
