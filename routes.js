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
    }
  });

  this.route('serps', { 
  	path: '/find/:keywords',
  	template: 'results',
  	waitOn: function() { 
      Meteor.call('search', this.params.keywords, function() {
        console.log("Search Run");
      });
      return Meteor.subscribe('search_results', this.params.keywords); 
  	},
	  // posts: function() { 
		 //  return Meteor.subscribe('search_results', this.params.keywords);
   //    // return Posts.find({}, {sort: {time: -1}, limit:25});
	  // },
	  data: function () { // this.params is available inside the data function
      var post_ids = [],
      sr = Search_results.findOne({"keywords":this.params.keywords});
      // console.log('ROUTER SR',sr.posts, sr.posts.length);
      if(sr.posts && sr.posts.length > 0 ){
        for(var i in sr.posts){
          // console.log("ROUTER P", sr.posts[i])
          post_ids.push(sr.posts[i]._id);
        }
        // console.log("ROUTER Result Count", post_ids);
      }

      return { 
        keywords: this.params.keywords,
        post_ids: post_ids
      }
    }
  });

});