const data = require('@begin/data');
const { InvalidInputError } = require("./errors");

async function save({ email, account }) {
  if (!email || !account.id) {
    throw new InvalidInputError();
  }

  await data.set({
    table: "interests-" + account.id,
    accountId: account.id,
    email: email
  });

  return {
    email,
  }
}

module.exports = {
  save,
}
