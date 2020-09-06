const assert = require("assert");
const User = require("../src/user");

describe("Subdocuments", () => {
  // Check we can create and save a user with a subdocument
  it("Can create a subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "PostTitle" }],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts[0].title === "PostTitle");
        done();
      });
  });

  it("Can add subdocuments to an existing record", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        user.posts.push({ title: "New Post" });
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts[0].title === "New Post");
        done();
      });
  });

  it("Can remove an existing subdocument", (done) => {
    const joe = new User({
      name: "Joe",
      posts: [{ title: "New Title" }],
    });

    joe
      .save()
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        const post = user.posts[0];
        post.remove(); // Mongoose alternative to remove object from array
        return user.save();
      })
      .then(() => User.findOne({ name: "Joe" }))
      .then((user) => {
        assert(user.posts.length === 0);
        done();
      });
  });
});

/*
  1 Test adding a post to existing user "Can add subdocuments to an existing record" steps
  Create Joe
  Save Joe
  Fetch Joe
  Add a post to Joe
  Save Joe
  Fetch Joe
  Make assertion

  2 Test delete existing post from existing user "Can remove an existing subdocument" steps
  Create Joe with post
  Save Joe
  Fetch Joe
  Remove post from Joe
  Save Joe
  Fetch Joe
  Make assertion

*/
