import handler from "./index.js";
import http from "http";

const server = http.createServer(async (req, res) => {
  const reqHeaders = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    reqHeaders.set(key, value);
  }

  const request = new Request(`http://localhost${req.url}`, {
    method: req.method,
    headers: reqHeaders,
    body: req
  });

  const response = await handler(request);

  res.statusCode = response.status;
  response.headers.forEach((value, key) => res.setHeader(key, value));

  const body = Buffer.from(await response.arrayBuffer());
  res.end(body);
});

server.listen(8080, () => {
  console.log("Server running on :8080");
});
