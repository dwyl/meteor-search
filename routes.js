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
  	path: '/find/:keyword',
  	template: 'results',
  	waitOn: function() { 
  		return Meteor.subscribe('results'); 
  	},
	posts: function() { 
		return Posts.runCommand( "text", { search: this.params.keyword } );
	},
	data: function () { // this.params is available inside the data function
      return { keyword: this.params.keyword }
    }
  });

});