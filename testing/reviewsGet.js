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

  await col.updateOne({ _id: bobId }, { $push: { "phoneNumbers": { _id: new mdb.ObjectId(), number: "123-456-7890" } } })
  await col.updateOne({ _id: bobId }, { $push: { "phoneNumbers": { _id: new mdb.ObjectId(), number: "567-890-1234" } } })

  const filter = { _id: bobId };
  const matchingStage = {
    $match: filter
  }
  const getNumbersOnly = { $replaceWith: { "result": "$phoneNumbers" } }
  const updateIds = {
    $set: {
      "result": {
        $map: {
          input: '$result',
          as: "inVal",
          in: {
            $setField: {
              field: "_id",
              input: "$$inVal",
              value: {
                $convert: {
                  input: "$$inVal._id",
                  to: "string"
                }
              }
            }
          }
        }
      }
    }
  }
  const pipeline = [matchingStage, getNumbersOnly, updateIds]
  let res = await col.aggregate(pipeline)
  res = await res.toArray()
  console.log(res);
  console.log(res[0].result);
}

(async () => {
  await main();
})()