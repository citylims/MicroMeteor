Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

Posts.deny({
  update: function(userId, post, fieldNames) {
    return(_.without(fieldNames, 'url', 'title').length > 0);
  }
});

validatePosts = function(post) {
  var errors = {};

  if (!post.title)
    errors.title = "Please fill in a headline";

  if (!post.url)
    errors.url = "Please fill in a URL";

  return errors;
}

Meteor.methods({
  postInsert: function(postAttributes) {
    //sanitize id
    check(this.userId, String);
    //sanitize
    check(postAttributes, {
      title: String,
      url: String
    });

    var errors = validatePosts(postAttributes);
    if (errors.title || errors.url) {
      throw new Meteor.Error('invalid-post', 'Your must set a title and URL for post');
    }

    //check for uniqueness of submitted url
    var postWithSameLink = Posts.findOne({url: postAttributes.url});
    if (postWithSameLink) {
      //breakpoint
      return {
        postExists: true,
        _id: postWithSameLink._id
      }
    }

    //get current user
    var user = Meteor.user();
    //define post obj;
    var post = _.extend(postAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });
    //insert post obj and grab ID
    var postId = Posts.insert(post);
    //return id for router
    return {
      _id: postId
    };
  }//postInsert
});
