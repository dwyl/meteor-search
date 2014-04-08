
Meteor.subscribe('search_results', this.keywords);
Meteor.subscribe('posts');
Meteor.subscribe('all_results');
Meteor.subscribe('postsCount');

Template.posts.entries = function(){
	var entries = Posts.find();
	// console.log('hai!')
	return entries;
};

Template.post.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg';
	},
	highlightText: function() {
		return highlight(this.text);
	}
})

Template.results.helpers({
	avatarsrc: function() {
		return this.avatar || 'http://www.fashionally.com/images/default_profile_pic.jpg';
	},
	keywords: function() {
		return this.keywords;
	}, 
	results: function() {
		Meteor.subscribe('search_posts', this.post_ids);
  	return Posts.find({_id:{"$in":this.post_ids}},{sort: {time: -1}});
	}
});

Handlebars.registerHelper('highlight', function(text) {
  var hashtagPattern = /\s*(#\w*)/gi, 
    link = "/search/", 
    m, match, matches = [], t, url ='';

  // initial check for hashtag in text
  if(text.indexOf("#") !== -1) {   

      // find all #keywords (that have hashtags)
      while ( (match = hashtagPattern.exec(text)) ) {
        matches.push(match[0]);
      }

      // replace any #keywords with <a href="/search/keywords">#keywords</a>
      for(var j=0; j < matches.length; j++) {
        m = matches[j].replace(/\s/g, "");
        // console.log('match',m);
        url = link+m;
        url = url.replace('#',"").toLowerCase(); // remove hashtag for lookup
        t = " <a class='hashtag' href='"+url+"'>"+m+"</a> "; // replace with
        replace = new RegExp("\\s*("+m+")", 'gi');

        text = text.replace(replace, t);
      }
    }
  return text;
});

Handlebars.registerHelper('postsCount', function() {
	var result = PostsCount.find({}, {sort: {time: -1}, limit:1}).fetch();
	if(result && result[0] && result[0].count){
		// console.log(result[0].count);
		return result[0].count;
	} else {
		return 0;
	}
});