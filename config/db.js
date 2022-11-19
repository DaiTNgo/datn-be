const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://daingo:t1ger1@database-dnt.dqvj7tl.mongodb.net/?retryWrites=true&w=majority';

// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db('test').collection('devices');
//   // perform actions on the collection object
//   client.close();
// });

async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    console.log('Connecting successfully');
  } catch (error) {
    console.log('Connecting failure', error);
    process.exit(1);
  }
}

module.exports = {
  connect,
};
