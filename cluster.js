import cluster from "cluster";
import http from "http";
import os from "os";
import { server } from "./app.js";
if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  console.log("master started");
  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.on("exit", () => {
      console.log("worker died");
      cluster.fork();
    });
    worker.send(numCPUs);
    worker.on("message", (msg) => {
      console.log(msg);
    });
  }
}
if (cluster.isWorker) {
  server(6000, process.pid);
  process.on("message", (msg) => {
    console.log(msg);
  });
  process.send(cluster.worker.id);
}
