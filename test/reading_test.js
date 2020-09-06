const assert = require("assert");
const User = require("../src/user");

describe("Reading users out of the database", () => {
  let joe, maria, alex, zach;

  // Set up test data
  beforeEach((done) => {
    alex = new User({ name: "Alex" });
    joe = new User({ name: "Joe" }); // Note behavior: new User() also automatically assigns an _id by Mongoose in contrast to other ORMs where an id is not assinged until saved to the database.
    maria = new User({ name: "Maria" });
    zach = new User({ name: "Zach" });

    Promise.all([joe.save(), alex.save(), maria.save(), zach.save()]).then(() =>
      done()
    );
  });

  it("finds all users with the name of joe", (done) => {
    User.find({ name: "Joe" }).then((users) => {
      assert(users[0]._id.toString() === joe._id.toString());
      done();
    });
  });

  it("find a user with a particular id", (done) => {
    User.findOne({ _id: joe._id }).then((user) => {
      assert(user.name === "Joe");
      done();
    });
  });

  it("can skip and limit the result set", (done) => {
    User.find({})
      .sort({ name: 1 })
      .skip(1)
      .limit(2)
      .then((users) => {
        assert(users.length === 2);
        assert(users[0].name === "Joe");
        assert(users[1].name === "Maria");
        done();
      });
  });
});

/*
  1 Note
  User.find({}) returns array
  User.findOne({}) returns record

  2 Note _id are ObjectId
  it("finds all users with the name of joe", (done) => {
    User.find({ name: "Joe" }).then((users) => {
      // console.log(users[0]._id, joe._id); // Identical ids at this point but note that Mongodb _ids is actually an ObjectId and not just a raw string. For comparison we need .toString().
      // console.log(users); // [ { _id: 5f4fb3dc629b1e0421c14d19, name: 'Joe', __v: 0 } ]

      assert(users[0]._id.toString() === joe._id.toString());
      done();
    });
  });
*/
