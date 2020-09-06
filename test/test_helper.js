const mongoose = require("mongoose");

// ES6 implementation of promises.  No longer needed b/c no deprecation warning.
// mongoose.Promise = global.Promise;

// Mocha.HookFunction - executed only ever one time for entire test suite.  Used here to establish connection before any tests.
before((done) => {
  mongoose.connect("mongodb://localhost/users_test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  mongoose.connection
    .once("open", () => {
      done(); // Only once we have successfully opened a connection to Mongo inform Mocha we are ready to run tests.
    })
    .on("error", (error) => console.warn("Warning", error));
});

/*
  1 Mocha.HookFunction - clean up before each test run in our test suite. 'done' cb provided by Mocha.
  2 Note that we cannot drop multiple collections inside of Mongo at the same time and therefore we are taking sequential approach below.
  3 Note Mongoose normalizes each collection name by lower casing collection name and pluralizing it.
*/
beforeEach((done) => {
  const { users, comments, blogposts } = mongoose.connection.collections;

  users.drop(() => {
    comments.drop(() => {
      blogposts.drop(() => {
        done();
      });
    });
  });
});

/* 
  1 Note
  .drop() accepts a cb that will be run at a later time after the drop operation is complete.
  done() is a function provided by Mocha automatically to pause tests until current execution is complete ie done() is executed.
  
  2 Ref
  beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
      done(); // Ready to run the next test
    });
  });
*/
