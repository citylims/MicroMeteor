Posts = new Mongo.Collection('posts');

Posts.allow({
  update: function(userId, post) {
    return ownsDocument(userId, post);
  },
  remove: function(userId, post) {
    return ownsDocument(userId, post);
  }
});

Meteor.methods({
  postInsert: function(postAttributes) {
    //sanitize id
    check(Meteor.userId(), String);
    //sanitize
    check(postAttributes, {
      title: String,
      url: String
    });

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
