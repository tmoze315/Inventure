const { connect, connection } = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongodb = new MongoMemoryServer();

beforeAll(async () => {
    const url = await mongodb.getUri();

    await connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
        autoIndex: true,
    });
});

afterAll(async () => {
    await connection.close();
    await mongodb.stop();
});

afterEach(async () => {
    await connection.dropDatabase();
});

// expect.extend({
//     discordMessageContaining: () => {
        
//     }
// });