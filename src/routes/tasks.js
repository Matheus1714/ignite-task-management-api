import http from "node:http";

import { buildRoutePath } from "../utils/build-route-path.js";
import { TaskRepository } from "../repositories/task-repository.js";

/**
 * @typedef {Object} Route
 *
 * @property {string} method
 * @property {RegExp} path
 * @property {function(http.IncomingMessage, http.ServerResponse): http.ServerResponse} handler
 */

const taskRepository = new TaskRepository();

/**
 * @type {Route[]}
 */
export const tasksRoutes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.query;

      const tasks = taskRepository.getTasks({ title, description });

      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      if (!req.body) res.writeHead(400).end();
      const { title, description } = req.body;

      try {
        const task = taskRepository.createTask({ title, description });
        return res.writeHead(201).end(JSON.stringify(task));
      } catch (err) {
        return res.writeHead(400).end(JSON.stringify({ err: String(err) }));
      }
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

      try {
        taskRepository.deleteTaskById(id);
        return res.writeHead(204).end();
      } catch (err) {
        return res.writeHead(400).end(JSON.stringify({ err: String(err) }));
      }
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

      try {
        const task = taskRepository.updateTask(id, { title, description });
        return res.end(JSON.stringify(task));
      } catch (err) {
        return res.writeHead(400).end(JSON.stringify({ err: String(err) }));
      }
    },
  },
  {
    method: "PATCH",
    path: buildRoutePath("/tasks/:id/complete"),
    handler: (req, res) => {
      const { id } = req.params;

      if (!id) {
        return res.writeHead(400).end();
      }

      try {
        const task = taskRepository.completeTask(id);
        return res.end(JSON.stringify(task));
      } catch (err) {
        return res.writeHead(400).end(JSON.stringify({ err: String(err) }));
      }
    },
  },
];
