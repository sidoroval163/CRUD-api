import http from "http";
const PORT = process.env.PORT || 5000;
import { Controller } from "./controller.js";
import { getReqData } from "./utils.js";
export const server = (port = PORT, pid) => {
  http
    .createServer(async (req, res) => {
      console.log(req.url, req.method);
      switch (true) {
        case req.url === "/api/users" && req.method === "GET":
          const users = await new Controller().getUsers();
          pid && res.setHeader("Process-Id", pid);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(users));
          break;

        case req.url.match(/\/api\/users\/[\w]/) && req.method === "GET":
          try {
            const id = req.url.split("/")[3];
            if (
              id.match(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
              )
            ) {
              const user = await new Controller().getUser(id);
              res.writeHead(200, { "Content-Type": "application/json" });
              pid && res.setHeader("Process-Id", pid);
              res.end(JSON.stringify(user));
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              // send the error
              res.end(
                JSON.stringify({ message: "userId is invalid (not uuid)" })
              );
            }
          } catch (error) {
            // set the status code and content-type
            res.writeHead(404, { "Content-Type": "application/json" });
            // send the error
            res.end(JSON.stringify({ message: error }));
          }
          break;
        case req.url === "/api/users" && req.method === "POST":
          try {
            let userData = JSON.parse(await getReqData(req));
            console.log(userData);
            if (
              typeof userData.username == "string" &&
              typeof userData.age == "number" &&
              Array.isArray(userData.hobbies)
            ) {
              await new Controller().createUser(userData);
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              // send the error
              res.end(
                JSON.stringify({
                  message: "request body does not contain required fields",
                })
              );
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            pid && res.setHeader("Process-Id", pid);
            res.end();
          } catch (error) {
            if (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "wrong REQUEST JSON FORMAT" }));
            }
          }
          break;
        case req.url.match(/\/api\/users\/[\w]/) && req.method === "PUT":
          try {
            const id = req.url.split("/")[3];
            if (
              id.match(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
              )
            ) {
              let userData = JSON.parse(await getReqData(req));
              if (
                typeof userData.username == "string" &&
                typeof userData.age == "number" &&
                Array.isArray(userData.hobbies)
              ) {
                await new Controller().updateUser(userData, id);
              } else {
                res.writeHead(400, { "Content-Type": "application/json" });
                // send the error
                res.end(
                  JSON.stringify({
                    message: "request body does not contain required fields",
                  })
                );
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              pid && res.setHeader("Process-Id", pid);
              res.end();
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });
              // send the error
              res.end(
                JSON.stringify({ message: "userId is invalid (not uuid)" })
              );
            }
          } catch (error) {
            if (error) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ message: "wrong REQUEST JSON FORMAT" }));
            }
          }
          break;
        case req.url.match(/\/api\/users\/[\w]/) && req.method === "DELETE":
          try {
            const id = req.url.split("/")[3];
            if (
              id.match(
                /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/
              )
            ) {
              await new Controller().deleteUser(id);
              res.writeHead(204, { "Content-Type": "application/json" });
              pid && res.setHeader("Process-Id", pid);
              res.end();
            } else {
              res.writeHead(400, { "Content-Type": "application/json" });

              res.end(
                JSON.stringify({ message: "userId is invalid (not uuid)" })
              );
            }
          } catch (error) {
            console.log(error);
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
          }
          break;
        default:
          console.log(req.url === "/api/users" && req.method === "GET");
          res.writeHead(404, { "Content-Type": "application/json" });
          pid && res.setHeader("Process-Id", pid);
          res.end(JSON.stringify({ message: "Route not found" }));
      }
    })
    .listen(port, () => {
      console.log(`server started on port: ${port}`);
    });
};
