import fs from "node:fs/promises";

const databasePath = new URL("../db.json", import.meta.url);

/**
 * @typedef { { [key: string]: string } } Row
 */

export class Database {
  /**
   * @type { { [key: string]: Array<Row> } }
   */
  #database = {};

  constructor() {
    fs.readFile(databasePath, "utf8")
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => this.#persist());
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2));
  }

  /**
   * @param { string } table
   * @param { Row } search
   */
  select(table, search) {
    let data = this.#database[table] ?? [];

    if (search) {
      data = data.filter((row) =>
        Object.entries(search).some(([key, value]) =>
          row[key].toLowerCase().includes(value.toLowerCase())
        )
      );
    }

    return data;
  }

  /**
   * @param { string } table
   * @param { string } id
   */
  findById(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    return rowIndex > -1 ? this.#database[table][rowIndex] : null;
  }

  /**
   * @param {string} table
   * @param { Row } data
   */

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }
    this.#persist();
    return data;
  }

  /**
   * @param {string} table
   * @param { Row[] } data
   */
  insertAll(table, data) {
    if (!data.length) return;

    if (Array.isArray(this.#database[table])) {
      this.#database[table] = [...this.#database[table], ...data];
    } else {
      this.#database[table] = [...data];
    }

    this.#persist();

    return data;
  }

  /**
   * @param {string} id
   * @param {string} table
   * @param { Row } data
   */
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex((row) => row?.id === id);

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { ...data, id };
      this.#persist();
    }
  }

  /**
   * @param {string} id
   * @param {string} table
   */
  delete(table, id) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
    }
  }
}
