const arc = require('@architect/functions');
const { errorHandler } = require("../../src/errors");
const authenticate = require("../../src/authenticate");
const interests = require("../../src/interests");

async function create(req) {
  try {
    const account = await authenticate(req)
    const { email } = req.body;
    const result = await interests.save({ email, account });

    return {
      statusCode: 203,
      body: JSON.stringify({
        status: "success",
        data: result
      }),
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      }
    }
  } catch (error) {
    return errorHandler(error);
  }
}

exports.handler = arc.http.async(create);
