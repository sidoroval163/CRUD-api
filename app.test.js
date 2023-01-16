import { get, request } from "node:http";
import { strict as assert } from "node:assert";

import { startServer } from "../src/server";

const testPort = 4000;
const testHost = "127.0.0.1";
const { server, host, port } = startServer(testPort, testHost);

server.on("listening", async () => {
  const usersURL = `http://${host}:${port}/api/users`;

  process.stdout.write("\nTest suite has started...\n\n");

  // Get all records with a GET api / users request(an empty array is expected)
  await itAsync("GET api/users/ should return list of users.", async () => {
    const result = await new Promise((resolve) => {
      get(usersURL, (res) => {
        let data = [];

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("close", () => {
          const json = JSON.parse(data.toString());
          resolve({
            data: json,
            statusCode: res.statusCode,
          });
        });
      });
    });

    assert.deepEqual(result, {
      statusCode: 200,
      data: [],
    });
  });

  process.stdout.write("\nTest suite has completed.\n\n");
  process.exit(0);
});
