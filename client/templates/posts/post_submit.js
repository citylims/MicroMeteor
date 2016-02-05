Template.postSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var post = {
      url: $(e.target).find('[name=url]').val(),
      title: $(e.target).find('[name=title]').val()
    };
    
    //set UID from mongo doc
    post._id = Posts.insert(post);
    //pass post object to the router -- with the UID
    Router.go('postPage', post);
  }
});
