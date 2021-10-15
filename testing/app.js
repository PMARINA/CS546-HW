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
  const readableIds = ['animals', 'birds', 'dogs', 'cats'];
  for (let i = 0; i < readableIds.length; i++) {
    const s = readableIds[i];
    let objToInsert = {
      '_id': new mdb.ObjectId(),
      idField: s,
      overallRating: 1.5,
      reviews: [],
    }
    await col.insertOne(objToInsert)
    for (let j = 0; j < 3; j++) {
      await col.updateOne({ idField: s }, {
        $push: {
          reviews: {
            '_id': new mdb.ObjectId(),
            Garbage: true,
            rating: j,
          }
        }
      })
    }
  }

  const colName = col.s.namespace.collection;
  const averageReviewsOp = {
    $cond:
    {
      if: { $gt: [{ $size: '$reviews' }, 0] },
      then: {
        '$divide':
          [
            { '$sum': '$reviews.rating' },
            { '$size': '$reviews' },
          ],
      },
      else: 0
    }
  };
  const mongoIdToMatch = 'birds';
  res = await col.aggregate([{ '$match': { 'idField': mongoIdToMatch } },
  { '$set': { 'overallRating': averageReviewsOp } },
  { '$merge': { into: colName, whenMatched: 'merge' } }]);


  const stringifyOuterObj = {
    "$convert": {
      input: '$$CURRENT._id',
      to: 'string',
    }
  }

  stringifyInnerObj = {
    "$convert": {
      input: '$$rev._id',
      to: 'string',
    }
  }
  const arrStringify = {
    $addFields: {
      _id: {
        "$convert": {
          input: '$$CURRENT._id',
          to: 'string',
        }
      },
      "reviews": {
        "$map": {
          "input": "$reviews",  // Get only unique ids from the array
          "as": "rev",
          "in": {
            $mergeObjects:
              [
                "$$rev", {
                  "_id": {
                    "$convert": {
                      input: '$$rev._id',
                      to: 'string',
                    }
                  }
                },
            ],
          }
        },
      },
    }
  }

      res = await col.aggregate([
        // { '$match': { 'idField': mongoIdToMatch } },
        arrStringify,]);
      // { '$merge': { into: colName, whenMatched: 'merge' } }]);
      console.log((await res.toArray()));




    }

      (async () => {
        await main();
      })()