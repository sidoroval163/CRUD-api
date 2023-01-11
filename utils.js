export function getReqData(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      // listen to data sent by client
      req.on("data", (chunk) => {
        body += chunk.toString();
      });
      // listen till the end
      req.on("end", () => {
        // send back the data
        resolve(body);
      });
    } catch (error) {
      console.log("ошибка при чтении ");
      reject(error);
    }
  });
}
