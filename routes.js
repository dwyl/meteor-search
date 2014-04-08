Router.configure({ 
	layoutTemplate: 'layout',
	loadingTemplate: 'loading',
  results: function() {
    if(this.params.keywords){
      return this.params.keywords;
    } else {
      return false;
    }
  }

});

Router.map(function () {

  this.route('postsList', {
    path: '/',
    template: 'posts',
    waitOn: function() { return Meteor.subscribe('posts'); },
    posts: function() { 
      return Posts.find({}, {sort: {time: -1}, limit:25}) 
    },
    data: function() {
      return {
        postsCount: Posts.find().count()
      }
    }
  });

  this.route('search', { 
  	path: '/search/:keywords',
  	template: 'results',
  	waitOn: function() { 
      // insert keyword split/checking code here?
      Meteor.call('search', this.params.keywords, function() {
        console.log("Search Run");
      });
      return Meteor.subscribe('search_results', this.params.keywords); 
  	},
	  data: function () { // could reduce this to a map function but this is clear
      var post_ids = [],
      sr = Search_results.findOne({"keywords":this.params.keywords});
      if(sr && sr.posts && sr.posts.length > 0 ){
        for(var i in sr.posts){
          post_ids.push(sr.posts[i]._id);
        }
      }
      return { 
        keywords: this.params.keywords,
        post_ids: post_ids
      }
    }
  });

});