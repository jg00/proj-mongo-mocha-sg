const assert = require("assert");
const User = require("../src/user");
const Comment = require("../src/comment");
const BlogPost = require("../src/blogPost");

describe("Associations", () => {
  let joe, blogPost, comment;

  beforeEach((done) => {
    joe = new User({ name: "Joe" });
    blogPost = new BlogPost({
      title: "JS is Great",
      content: "Yep it really is",
    });
    comment = new Comment({ content: "Congrats on great post" });

    // Associations - Notice .push(a Model).  Howerver, Mongoose is aware of associations and knows to push just the reference id and not the whole model.
    joe.blogPosts.push(blogPost); // a user can have one or more posts
    blogPost.comments.push(comment); // a blog post can have one or more comments
    comment.user = joe; // comment has one author

    Promise.all([joe.save(), blogPost.save(), comment.save()]).then(() =>
      done()
    );
  });

  it("saves a relation between a user and a blogpost", (done) => {
    User.findOne({ name: "Joe" })
      .populate("blogPosts") // single level .populate() modifier
      .then((user) => {
        // console.log(user);
        assert(user.blogPosts[0].title === "JS is Great");
        done();
      });
  });

  // Deeply nested associations
  it("saves a full relation graph", (done) => {
    User.findOne({ name: "Joe" })
      .populate({
        path: "blogPosts", // path means look into user object, find blogPosts property, attempt to load any associated blogPosts
        populate: {
          path: "comments", // now inside of all the blogPosts you just fetched, find comments property, attempt to load any associated comments
          model: "comment", // need to indicate which model
          populate: {
            path: "user",
            model: "user",
          },
        },
      })
      .then((user) => {
        // console.log(user.blogPosts[0].comments[0]);
        assert(user.name === "Joe");
        assert(user.blogPosts[0].title === "JS is Great");
        assert(
          user.blogPosts[0].comments[0].content === "Congrats on great post"
        );
        assert(user.blogPosts[0].comments[0].user.name === "Joe");

        done();
      });
  });
});

/*
  1 Re it.only("saves a relation between a user and a blogpost" before .populate() modifier which lets you reference documents in other collections.
  {
    blogPosts: [ 5f5395170e1520069e2497f1 ], << notice we have blogPost id but we want our actual blogPost {} object.
    _id: 5f5395170e1520069e2497f0,
    name: 'Joe',
    posts: [],
    __v: 0
  }

  2 it.only() - pause tests

  3 xit() - do not run

  4 Note be careful with the number of associations you load up.
*/
