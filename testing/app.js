mdb = require('mongodb')
const uri = 'mongodb://localhost'
async function main() {
  const client = new mdb.MongoClient(uri);
  await client.connect();

  let db = client.db('testing')
  db.dropDatabase();
  db = client.db('testing')
  col = db.collection('testing')

  await doTesting(col)

  client.close()
}

async function doTesting(col) {
  let bobInfo = await col.insertOne({
    name: "Bob",
    email: "bob@example.com",
    phoneNumbers: []
  })

  let jamieInfo = await col.insertOne({
    name: "Jamie",
    email: "jhamp@pnra.org",
    phoneNumbers: []
  })

  bobId = bobInfo.insertedId;
  jamieId = jamieInfo.insertedId;

  await col.updateOne({ _id: bobId }, { $push: { "phoneNumbers": { _id: new mdb.ObjectId(), number: "123-456-7890" } } })
  await col.updateOne({ _id: bobId }, { $push: { "phoneNumbers": { _id: new mdb.ObjectId(), number: "567-890-1234" } } })

  jamiePhoneId = new mdb.ObjectId();
  await col.updateOne({ _id: jamieId }, { $push: { "phoneNumbers": { _id: new mdb.ObjectId(), number: "123-456-999-888-7777" } } })
  await col.updateOne({ _id: jamieId }, { $push: { "phoneNumbers": { _id: jamiePhoneId, number: "999-888-7777" } } })

  // Begin Solution
  const filter = {"phoneNumbers._id": jamiePhoneId};
  const matchingStage = {
    $match: filter
  }

  const getNumbersOnly = { $replaceWith: { "result": "$phoneNumbers" } }

  const unwindArr = {$unwind: "$result"}

  const matchIdInSubDoc = {$match: {"result._id": jamiePhoneId}};

  results = await col.aggregate([matchingStage, getNumbersOnly, unwindArr, matchIdInSubDoc])
  results = await results.toArray()
  console.log(results[0].result);
}

(async () => {
  await main();
})()