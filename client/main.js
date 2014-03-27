// Posts = new Meteor.Collection('posts');

Template.posts.entries = function(){
	var entries = Posts.find();
	console.log('hai!')
	return entries;
};

Template.post.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg'
	}
})