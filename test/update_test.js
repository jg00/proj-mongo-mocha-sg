const assert = require("assert");
const User = require("../src/user");

describe("Updating records", () => {
  let joe;

  beforeEach((done) => {
    joe = new User({ name: "Joe", likes: 0 });
    joe.save().then(() => done());
  });

  function assertName(operation, done) {
    operation
      .then(() => User.find({})) // note - {} no criteria returns all
      .then((users) => {
        assert(users.length === 1);
        assert(users[0].name === "Alex");
        done();
      });
  }

  it("instance type using set and save", (done) => {
    joe.set({ name: "Alex" }); // note - in memory only. Not yet persisted to db.
    assertName(joe.save(), done); // persist
  });

  it("A model instance can update", (done) => {
    assertName(joe.updateOne({ name: "Alex" }), done);
  });

  it("A model class can update", (done) => {
    assertName(User.updateMany({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can update one record", (done) => {
    assertName(User.findOneAndUpdate({ name: "Joe" }, { name: "Alex" }), done);
  });

  it("A model class can find a record with an Id and update", (done) => {
    assertName(User.findByIdAndUpdate(joe._id, { name: "Alex" }), done);
  });

  it("A user can have their likes incremented by 1", (done) => {
    User.updateMany({ name: "Joe" }, { $inc: { likes: 10 } })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.likes === 10);
        done();
      });
  });
});

/*
  1 DeprecationWarning: collection.update is deprecated. 
  Use updateOne, updateMany, or bulkWrite instead.
*/
