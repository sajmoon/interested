let tiny = require('tiny-json-http')
let test = require('tape')
let sandbox = require('@architect/sandbox')
const data = require("@begin/data");
const baseUrl = "http://localhost:3333"
let currentAccountId = Date.now();

async function createSampleAccount() {
  const accessKey = await data.set({
    table: "apikeys",
    created: Date.now(),
    accountId: ++currentAccountId,
  })
  return accessKey;
}

test('start', async t => {
  t.plan(1)
  await sandbox.start()
  t.ok(true, 'started')
})

const validBody = {
  email: "test@example.com",
}

test('requires an api key to save an interest', async t=> {
  t.plan(1)
  try {
    await tiny.post({url: baseUrl + "/interests", data: validBody})
  }
  catch(e) {
    t.equal(e.statusCode, 403, 'not allowed without api key')
  }
})

test('we can save and retreive submissionns', async t=> {
  t.plan(3)

  const accessKey = createSampleAccount();

  const headers = {
    "api-key": accessKey.key
  }

  const result = await tiny.post({url: baseUrl + "/interests", headers, data: validBody })
  const body = result.body;

  t.equal(body.status, "success", 'ok with an api key')
  t.deepLooseEqual(body.data, { email: "test@example.com" }, 'returns the data for an interested email')

  const readUrl = 'http://localhost:3333/interests'
  const submissions = await tiny.get({ url: readUrl, headers })

  t.equal(submissions.body.interests.length, 1)
})

test('post /interests requires some attributes in body', async t=> {
  t.plan(2)
  const accessKey = createSampleAccount();

  try {
    let url = 'http://localhost:3333/interests'
    const headers = {
      "api-key": accessKey.key 
    }

    await tiny.post({url, headers, data: { ...validBody, email: "" } })
  } catch (e) {
    const actualBody = e.body;
    t.deepLooseEqual(actualBody, { status: "invalid"}, "status should say it is invalid");
    t.equal(e.statusCode, 400, 'expects bad request')
  }
})

test("get /interests returns status for the given api key", async t => {
  t.plan(1);

  const accessKey = createSampleAccount();
  let url = 'http://localhost:3333/interests'
  const headers = {
    "api-key": accessKey.key 
  }

  const result = await tiny.get({url, headers })

  t.deepLooseEqual(result.body, { interests: [] })
});

test('end', async t=> {
  t.plan(1)
  await sandbox.end()
  t.ok(true, 'ended')
})
