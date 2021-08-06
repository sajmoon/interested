let arc = require('@architect/functions')
let data = require('@begin/data');
const authenticate = require("../../src/authenticate");

exports.handler = async function read(req) {
  try {
  const account = await authenticate(req);
  const interests = await data.get({
    table: 'interests-' + account.id,
    limit: 25,
  })

  let results = []
  for await (let interest of interests) {
    results.push(interest)
  }

  results.sort((a, b) => a.created - b.created)
  const body = { interests: results }

  return {
    statusCode: 201,
    headers: {
      'content-type': 'application/json; charset=utf8',
      'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
    },
    body: JSON.stringify(body)
  }
  } catch (error) {
    if (error.name === "NotAuthorizedError") {
      return {
        statusCode: 403,
        headers: {
          'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
        }
      }
    } 

    return { 
      statusCode: 500
    }
  }
}
