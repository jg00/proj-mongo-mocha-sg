const assert = require("assert");
const User = require("../src/user");

describe("Validating records", () => {
  // Test we get an error if a required specific property on user model is not provided
  it("requires a user name", () => {
    const user = new User({ name: undefined });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === "Name is required.");
  });

  // Test we get an error if a required custom validation for user name minimum length is not met
  it("requires a user's name longer than 2 characters", () => {
    const user = new User({ name: "Al" });
    const validationResult = user.validateSync();
    const { message } = validationResult.errors.name;

    assert(message === "Name must be longer than 2 characters.");
  });

  // Testing and handling failed inserts.  Tests that we are successfully catching the fail to successfuly insert the new record into our database because it is not a valid record
  it("disallows invalid records from being saved", (done) => {
    const user = new User({ name: "Al" });
    user.save().catch((validationResult) => {
      const { message } = validationResult.errors.name;

      assert(message === "Name must be longer than 2 characters.");
      done();
    });
  });
});

/*
  1 MongooseDocument.validateSync() vs .validate(cb)
  .validateSync() is a synchronous validation process.  Returns error {} object.
  .validate((validationResult) => {}) used to run any async validation. Does not return error object. Instead provide a cb called after async process completes.
*/
