Router.configure({ 
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
	waitOn: function() { return Meteor.subscribe('posts'); },
	posts: function() { return Posts.find({}, {sort: {time: -1}, limit:25})
  }
});

Router.map(function () {

  this.route('postsList', {
    path: '/',
    template: 'posts'
  });

  this.route('postPage', { 
  	path: '/posts/:_id'
  });

});