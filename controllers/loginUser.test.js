// const { loginUser } = require("./users");
// const { DB_HOST } = process.env;

// const { MongoClient } = require("mongodb");

// describe("insert", () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(globalThis.DB_HOST, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db(globalThis.db_contacts);
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

  // it("should insert a doc into collection", async () => {
  //   const users = db.collection("users");

  //   const mockUser = { _id: "some-user-id", name: "John" };
  //   await users.insertOne(mockUser);

  //   const insertedUser = await users.findOne({ _id: "some-user-id" });
  //   expect(insertedUser).toEqual(mockUser);
  // });

//   test("loginUser", async () => {
//     const data = await loginUser( );
//     console.log(data);
//     expect(data).toBe("");
//   });
// });
