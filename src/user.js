const mongoose = require("mongoose");
const PostSchema = require("./post");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    validate: {
      validator: (name) => name.length > 2,
      message: "Name must be longer than 2 characters.",
    },
    required: [true, "Name is required."],
  },
  // postCount: Number,
  posts: [PostSchema],
  likes: Number,
  blogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: "blogPost",
    },
  ],
});

// Define Virtual Property with getter. Use function keyword to access 'this' model instance
UserSchema.virtual("postCount").get(function () {
  return this.posts.length;
});

/*
  // Define Middleware - events (init, validate, save, remove), middleware functions (.pre(), .post())
  1 this === instance of new User (this === joe)
  2a Use mongoose.model() function to pull another model out of Mongoose that has already been registered.
  2b Get direct reference to blogPost model by using mongoose.model() helper function
  3a Access the referenced model here instead of require up top. Best to avoid require of models during app loading (that require each other like user and blogPost models) above until needed within the middleware function to avoid cyclical requires.
  3b This means the mongoose.model() call will not be invoked until this function actually runs.
  4 Note avoid solution where you will iterate over array of ids to delete like below.  (Instead use a Mongo 'query' operator)
    this.blogPosts.each(id => {
      BlogPost.remove({_id: _id})
    }
*/
UserSchema.pre("remove", function (next) {
  const BlogPost = mongoose.model("blogPost");

  BlogPost.deleteMany({ _id: { $in: this.blogPosts } }).then(() => next());
});

const User = mongoose.model("user", UserSchema);

module.exports = User;

/*
  1 User Model Note
  User model represents the entire collection of data that sits inside of our Mongo database.
  
  2 Custom Validators 
  name: {
    validate: {
      validator: () => predicate,
      message: ..
    }
  }
*/
