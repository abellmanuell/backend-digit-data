function server_response(
  status = 200,
  response,
  message = null,
  options = null
) {
  response.header(
    "Access-Control-Allow-Origin",
    process.env.ACCESS_CONTROL_ALLOW_ORIGIN
  );
  response.header(
    "Access-Control-Allow-Methods",
    "GET, OPTIONS, POST, PUT, DELETE"
  );
  response.header(
    "Access-Control-Allow-Headers",
    "origin, content-type, credentials, X-Requested-With, authorization"
  );
  response.header("Access-Control-Allow-Credentials", "true");
  response.status(status);
  response.header("Content-Type", "application/json");
  response.json({ status, message, ...options });
  response.end();
}

module.exports = { server_response };
