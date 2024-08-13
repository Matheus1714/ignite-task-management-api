import { randomUUID } from "node:crypto";

import { Database } from "../database.js";

export class TaskRepository {
  #database;
  #schema = "tasks";

  constructor() {
    this.#database = new Database();
  }

  getTasks({ title, description }) {
    const search = {};

    if (title) search.title = title;
    if (description) search.description = description;

    return this.#database.select(this.#schema, search);
  }

  createTask({ title, description }) {
    if (!title || !description) {
      throw new Error("Informações insuficientes");
    }

    const task = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null,
    };

    this.#database.insert(this.#schema, task);

    return task;
  }

  deleteTaskById(id) {
    const task = this.#database.findById(this.#schema, id);
    if (!task) {
      throw new Error(`Registro ${id} inexistente`);
    }
    this.#database.delete(this.#schema, id);
  }

  updateTask(id, { title, description }) {
    const task = this.#database.findById(this.#schema, id);
    if (!task) {
      throw new Error(`Registro ${id} inexistente`);
    }

    if (title) task.title = title;
    if (description) task.description = description;

    if (title || description) task.updated_at = new Date();

    this.#database.update(this.#schema, id, task);

    return this.#database.findById(this.#schema, id);
  }

  completeTask(id) {
    const task = this.#database.findById(this.#schema, id);

    if (!task) {
      throw new Error(`Registro ${id} inexistente`);
    }

    if (!task.completed_at) {
      task.completed_at = new Date();

      this.#database.update(this.#schema, id, task);
    }

    return task;
  }
}
