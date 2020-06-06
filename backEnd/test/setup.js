const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const app = require("../app");

let mongo;
beforeAll(async () => {
  // process.env.JWT_KEY = "asdfasdf";
  // tha pernao manually sta  tests to JWT kei sto kanoniko mou prohect tha to exo san enviroment variable kai prepein a valo to idio secret giati otan trexo test den tha exo access sto proces .env giait malon tha tkano import sto index.js file
  mongo = new MongoMemoryServer();

  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  // await mongo.stop();
  await mongoose.connection.close();
});
