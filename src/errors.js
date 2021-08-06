class NotAuthorizedError extends Error {
  constructor(message) {
    super(message)
    this.name = "NotAuthorizedError";
  }
}

class InvalidInputError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidInputError";
  }
}

function errorHandler(error) {
  if (error.name === "NotAuthorizedError") {
    return {
      statusCode: 403,
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      }
    }
  } 
  if (error.name === "InvalidInputError") {
    return {
      statusCode: 400,
      body: JSON.stringify({
        status: "invalid",
      }),
      headers: {
        'cache-control': 'no-cache, no-store, must-revalidate, max-age=0, s-maxage=0'
      }
    }
  }

  return { 
    statusCode: 500
  }
}

module.exports = {
  InvalidInputError,
  NotAuthorizedError,
  errorHandler
}
