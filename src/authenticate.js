const data = require("@begin/data");
const { NotAuthorizedError } = require("../src/errors");

module.exports = async function authenticate(req) {
  const apiKey = req.headers["api-key"]

  const accessKey = await data.get({
    table: "apikeys",
    key: apiKey,
    limit: 1
  })

  if (accessKey.length === 0) {
    throw new NotAuthorizedError()
  }

  return { id: accessKey[0].accountId, };
}
