// Posts = new Meteor.Collection('posts');

Template.posts.entries = function(){
	var entries = Posts.find();
	console.log('hai!')
	return entries;
};
