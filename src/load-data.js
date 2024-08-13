import fs from "node:fs";

import { parse } from "csv-parse";

const parser = parse({
  delimiter: ",",
});

let count = 0;

fs.createReadStream("data.csv")
  .pipe(parser)
  .on("data", async (data) => {
    count++;
    if (count > 1) {
      const [title, description] = data;

      await fetch("http://localhost:3000/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
    }
  });
